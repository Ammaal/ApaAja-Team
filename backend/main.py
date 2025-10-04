import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import json
from typing import Optional, List, Dict
import datetime
import locale
import re
import copy

# Load environment variables from .env file
load_dotenv()

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str
    conversation_history: list[dict] = []
    session_id: str

class BookingRequest(BaseModel):
    status: str = "AWAITING_DETAILS"
    origin: Optional[str] = None
    destination: Optional[str] = None
    date: Optional[str] = None
    passengers: Optional[int] = None
    selected_train: Optional[dict] = None
    passenger_details: list[dict] = []
    last_search_results: list[dict] = []
    language: str = "en" # Default language

class SearchRequest(BaseModel):
    origin: str
    destination: str
    date: str

class PassengerInfo(BaseModel):
    name: str
    idNumber: str

class AlternativeBookingRequest(BaseModel):
    route: dict
    passengers: int
    passengersInfo: List[PassengerInfo]
    selectedSeats: Dict[str, List[str]]
    totalPrice: float

# --- In-Memory Storage ---
booking_sessions: Dict[str, BookingRequest] = {}
booked_orders: List[Dict] = [
    {
        "id": "TRX1722784264",
        "isAlternative": False,
        "trainId": "KAI001",
        "trainName": "Argo Bromo Anggrek",
        "origin": "Jakarta",
        "destination": "Surabaya",
        "date": "2024-08-15",
        "time": "08:00",
        "passengers": 1,
        "price": 500000,
        "status": "confirmed",
        "passengersInfo": [{"name": "John Doe", "idNumber": "1234567890"}],
        "refundStatus": None,
        "legs": []
    }
]

# --- Mock Data (with city information) ---
mock_trains = [
    {
        "train_id": "KAI001", "train_name": "Argo Bromo Anggrek", "train_type": "Executive",
        "departure": {"station_code": "GMR", "station_name": "Gambir", "city": "Jakarta", "time": "08:00"},
        "arrival": {"station_code": "SGU", "station_name": "Surabaya Pasarturi", "city": "Surabaya", "time": "17:00"},
        "duration": "9h 0m", "price": 500000, "available_seats": 50
    },
    {
        "train_id": "KAI002", "train_name": "Gajayana", "train_type": "Executive",
        "departure": {"station_code": "GMR", "station_name": "Gambir", "city": "Jakarta", "time": "18:40"},
        "arrival": {"station_code": "ML", "station_name": "Malang", "city": "Malang", "time": "09:27"},
        "duration": "14h 47m", "price": 650000, "available_seats": 30
    },
    {
        "train_id": "KAI003", "train_name": "Taksaka", "train_type": "Executive",
        "departure": {"station_code": "GMR", "station_name": "Gambir", "city": "Jakarta", "time": "20:45"},
        "arrival": {"station_code": "YK", "station_name": "Yogyakarta", "city": "Yogyakarta", "time": "04:15"},
        "duration": "7h 30m", "price": 480000, "available_seats": 20
    },
    {
        "train_id": "KAI004", "train_name": "Argo Lawu", "train_type": "Executive",
        "departure": {"station_code": "GMR", "station_name": "Gambir", "city": "Jakarta", "time": "08:30"},
        "arrival": {"station_code": "SLO", "station_name": "Solo Balapan", "city": "Solo", "time": "16:45"},
        "duration": "8h 15m", "price": 520000, "available_seats": 40
    },
    {
        "train_id": "KAI005", "train_name": "Jayabaya", "train_type": "Economy",
        "departure": {"station_code": "PSE", "station_name": "Pasar Senen", "city": "Jakarta", "time": "16:45"},
        "arrival": {"station_code": "ML", "station_name": "Malang", "city": "Malang", "time": "07:20"},
        "duration": "14h 35m", "price": 280000, "available_seats": 100
    },
    {
        "train_id": "KAI006", "train_name": "Progo", "train_type": "Economy",
        "departure": {"station_code": "PSE", "station_name": "Pasar Senen", "city": "Jakarta", "time": "22:30"},
        "arrival": {"station_code": "LPN", "station_name": "Lempuyangan", "city": "Yogyakarta", "time": "07:10"},
        "duration": "8h 40m", "price": 180000, "available_seats": 15
    },
]

def normalize_city(city_name: str) -> str:
    """Normalizes city names to a standard format for consistent searching."""
    city_map = {
        "jakarta": "jakarta", "jkt": "jakarta",
        "surabaya": "surabaya", "sby": "surabaya",
        "yogyakarta": "yogyakarta", "yogya": "yogyakarta", "jogja": "yogyakarta", "jogjakarta": "yogyakarta",
        "bandung": "bandung", "bdg": "bandung",
        "semarang": "semarang", "smg": "semarang",
        "solo": "solo", "slo": "solo",
        "malang": "malang", "ml": "malang",
    }
    return city_map.get(city_name.lower().strip(), city_name.lower().strip())

def search_trains(origin: str, destination: str, date: str, passengers: int = 1):
    """
    Searches for direct trains based on origin, destination, and date.
    Returns a list of deep copies of matching trains.
    """
    results = [
        copy.deepcopy(train) for train in mock_trains
        if origin.lower() in train["departure"]["city"].lower() and
           destination.lower() in train["arrival"]["city"].lower()
    ]
    return results


def find_alternative_routes(origin: str, destination: str, date: str):
    """
    Finds alternative routes with one transfer.
    This is a mock implementation and will be replaced with a real one.
    """
    # Normalize city names to handle variations consistently
    origin_normalized = origin.strip().lower()
    destination_normalized = destination.strip().lower()

    # Mock data for alternative routes with lowercase keys for matching
    alternatives = {
        ("jakarta", "surabaya"): [
            {
                "route": "Jakarta → Cirebon → Surabaya",
                "totalDuration": "11h 30m",
                "transfers": 1,
                "totalPrice": 550000,
                "legs": [
                    {"from": "Jakarta", "to": "Cirebon", "trainName": "Argo Cheribon", "category": "Executive", "duration": "3h 0m", "price": 250000, "departureTime": "08:00", "arrivalTime": "11:00", "date": date},
                    {"from": "Cirebon", "to": "Surabaya", "trainName": "Bima", "category": "Executive", "duration": "8h 30m", "price": 300000, "departureTime": "12:00", "arrivalTime": "20:30", "date": date}
                ]
            }
        ],
        ("jakarta", "yogyakarta"): [
            {
                "route": "Jakarta → Bandung → Yogyakarta",
                "totalDuration": "10h 15m",
                "transfers": 1,
                "totalPrice": 420000,
                "legs": [
                    {"from": "Jakarta", "to": "Bandung", "trainName": "Argo Parahyangan", "category": "Executive", "duration": "3h 15m", "price": 150000, "departureTime": "09:00", "arrivalTime": "12:15", "date": date},
                    {"from": "Bandung", "to": "Yogyakarta", "trainName": "Lodaya", "category": "Business", "duration": "7h 0m", "price": 270000, "departureTime": "13:00", "arrivalTime": "20:00", "date": date}
                ]
            }
        ]
    }
    
    found_routes = alternatives.get((origin_normalized, destination_normalized), [])
    
    # Dynamically add origin and destination to each route object for frontend consistency
    for route in found_routes:
        route['origin'] = origin.title()
        route['destination'] = destination.title()

    return found_routes

def get_order_status(order_id: str):
    """Looks up an order by its ID and returns its status."""
    print(f"Searching for order with ID: {order_id}")
    for order in booked_orders:
        if order.get("id") == order_id:
            return {
                "status": "success",
                "order_id": order_id,
                "train_name": order["trainName"],
                "destination": order["destination"],
            }

def book_ticket_from_chat(train_id: str, date: str, passengers: int, passengers_info: List[Dict]):
    """Books a ticket from the chatbot, creating an order and storing it."""
    selected_train = next((train for train in mock_trains if train['train_id'] == train_id), None)

    if not selected_train:
        return {"status": "error", "message": f"Train with ID {train_id} not found."}

    order_id = f"TRX{int(datetime.datetime.now().timestamp())}"
    
    new_order = {
        "id": order_id,
        "isAlternative": False,
        "trainId": train_id,
        "trainName": selected_train["train_name"],
        "origin": selected_train["departure"]["city"],
        "destination": selected_train["arrival"]["city"],
        "date": date,
        "time": selected_train["departure"]["time"],
        "passengers": passengers,
        "price": selected_train["price"] * passengers,
        "status": "confirmed",
        "passengersInfo": passengers_info,
        "refundStatus": None,
        "legs": []
    }

    booked_orders.append(new_order)
    print(f"Successfully booked order via chat: {order_id}")
    
    return {
        "status": "success",
        "order_id": order_id,
        "train_name": new_order["trainName"],
        "destination": new_order["destination"],
    }

# --- TAMBAHKAN DICTIONARY INI UNTUK MEMETAKAN FUNGSI ---
available_functions = {
    "search_trains": search_trains,
    "find_alternative_routes": find_alternative_routes,
    "get_order_status": get_order_status,
    "book_ticket_from_chat": book_ticket_from_chat,
}

class SearchRequest(BaseModel):
    origin: str
    destination: str
    date: str

class PassengerInfo(BaseModel):
    name: str
    idNumber: str

class AlternativeBookingRequest(BaseModel):
    route: dict
    passengers: int
    passengersInfo: List[PassengerInfo]
    selectedSeats: Dict[str, List[str]]
    totalPrice: float

# --- FastAPI App Setup ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.post("/api/search-routes")
async def search_routes_endpoint(request: SearchRequest):
    try:
        origin = request.origin.strip().lower()
        destination = request.destination.strip().lower()
        date = request.date

        direct_routes = search_trains(origin, destination, date)
        
        # Add the date to each direct route found
        for route in direct_routes:
            route['date'] = date

        alternative_routes = find_alternative_routes(origin, destination, date)

        return {
            "direct_routes": direct_routes,
            "alternative_routes": alternative_routes
        }
    except Exception as e:
        print(f"Error in /api/search-routes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/book-alternative-route")
async def book_alternative_route(request: AlternativeBookingRequest):
    try:
        order_id = f"TRX{int(datetime.datetime.now().timestamp())}"
        booking_date = datetime.datetime.now().strftime("%Y-%m-%d")

        new_order = {
            "id": order_id,
            "isAlternative": True,
            "trainName": f"Alternative: {request.route['origin']} - {request.route['destination']}",
            "origin": request.route['origin'],
            "destination": request.route['destination'],
            "date": booking_date,
            "passengers": request.passengers,
            "price": request.totalPrice,
            "status": "confirmed",
            "legs": [],
            "passengersInfo": [p.dict() for p in request.passengersInfo]
        }

        for i, leg in enumerate(request.route['legs']):
            leg_info = {
                "trainName": leg['trainName'],
                "origin": leg['from'],
                "destination": leg['to'],
                "date": leg['date'],
                "time": f"{leg['departureTime']} - {leg['arrivalTime']}",
                "seats": request.selectedSeats.get(str(i), [])
            }
            new_order["legs"].append(leg_info)

        booked_orders.append(new_order)
        return {"status": "success", "orderId": order_id, "orderDetails": new_order}
    except Exception as e:
        print(f"Error booking alternative route: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to book alternative route: {e}")


@app.get("/api/my-orders")
async def get_my_orders():
    return booked_orders

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        if not model:
            raise HTTPException(status_code=500, detail="GenerativeAI model not initialized.")

        # Build a valid history for the model
        history = []
        for message in request.conversation_history:
            role = "user" if message.get("role") == "user" else "model"
            content = message.get("content") or ""
            history.append({"role": role, "parts": [{"text": content}]})

        chat = model.start_chat(history=history)
        response = chat.send_message(request.message)

        # Loop to handle function calls from the model
        while response.candidates[0].content.parts[0].function_call:
            function_call = response.candidates[0].content.parts[0].function_call
            function_name = function_call.name
            args = dict(function_call.args)

            if function_name in available_functions:
                function_to_call = available_functions[function_name]
                function_response = function_to_call(**args)

                # Send the function's result back to the model
                response = chat.send_message(
                    genai.types.Part.from_function_response(
                        name=function_name,
                        response=function_response,
                    ),
                )
            else:
                # Handle case where the model calls a function that doesn't exist
                response = chat.send_message(
                     genai.types.Part.from_function_response(
                        name=function_name,
                        response={"status": "error", "message": f"Function '{function_name}' is not available."}
                    ),
                )
        
        # Once the loop is done, the final response is text
        final_response = response.text
        return {"content": final_response}

    except Exception as e:
        # Broad exception handler to prevent server crashes
        print(f"Error in /api/chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred in the chat service.")


@app.post("/api/submit-order")
async def submit_order(order: dict):
    """
    This endpoint is part of the old chatbot booking flow and is no longer in use.
    The booking logic is now handled by the frontend and dedicated API endpoints
    like /api/book-alternative-route.
    """
    pass


# --- Gemini API Configuration ---
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=GEMINI_API_KEY)

    # Define the function declarations for the model
    tools = [
        {
            "function_declarations": [
                {
                    "name": "search_trains",
                    "description": "Search for available train tickets between two cities on a specific date.",
                    "parameters": {
                        "type": "OBJECT",
                        "properties": {
                            "origin": {"type": "STRING", "description": "The departure city, e.g., 'Jakarta'"},
                            "destination": {"type": "STRING", "description": "The arrival city, e.g., 'Bandung'"},
                            "date": {"type": "STRING", "description": "The date of travel in YYYY-MM-DD format."},
                            "passengers": {"type": "INTEGER", "description": "The number of passengers."}
                        },
                        "required": ["origin", "destination", "date"]
                    }
                },
                {
                    "name": "find_alternative_routes",
                    "description": "Find alternative routes if no direct trains are available.",
                    "parameters": {
                        "type": "OBJECT",
                        "properties": {
                            "origin": {"type": "STRING", "description": "The departure city."},
                            "destination": {"type": "STRING", "description": "The arrival city."},
                            "date": {"type": "STRING", "description": "The date of travel in YYYY-MM-DD format."}
                        },
                        "required": ["origin", "destination", "date"]
                    }
                },
                {
                    "name": "get_order_status",
                    "description": "Get the current status of a booking order using its Order ID.",
                    "parameters": {
                        "type": "OBJECT",
                        "properties": {
                            "order_id": {"type": "STRING", "description": "The unique ID of the order, e.g., 'TRX1722784264'"}
                        },
                        "required": ["order_id"]
                    }
                },
                {
                "name": "book_ticket_from_chat",
                "description": "Books a train ticket after user has selected a train and provided all passenger details.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "train_id": {"type": "STRING", "description": "The ID of the selected train, e.g., 'KAI001'."},
                        "date": {"type": "STRING", "description": "The date of travel in YYYY-MM-DD format."},
                        "passengers": {"type": "INTEGER", "description": "The total number of passengers."},
                        "passengers_info": {
                            "type": "ARRAY",
                            "description": "A list of passenger details.",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "name": {"type": "STRING", "description": "Full name of the passenger."},
                                    "idNumber": {"type": "STRING", "description": "ID number of the passenger."}
                                }
                            }
                        }
                    },
                    "required": ["train_id", "date", "passengers", "passengers_info"]
                }
            }
            ]
        }
    ]
    
    SYSTEM_INSTRUCTION = """
    You are KAI Assistant, a friendly and helpful AI for booking train tickets in Indonesia.
    **Core Instructions:**
    1.  **Detect Language**: You MUST detect the user's language (English or Indonesian). Your responses MUST be in the same language.
    2.  **Be Concise and Friendly**: Keep your responses brief and helpful.
    3.  **Booking Flow**:
        a. **Search**: When a user wants to book a ticket, first use the `search_trains` function. If it returns no results, use `find_alternative_routes`.
        b. **Selection**: After showing the results, ask the user to select one train.
        c. **Collect Passenger Data**: Once a train is selected, you MUST ask for passenger details ONE BY ONE. Start by asking for the name and ID of "Passenger 1". After you get it, ask for "Passenger 2", and so on, until you have details for the correct number of passengers.
        d. **Finalize**: After collecting ALL passenger details, you MUST call the `book_ticket_from_chat` function with all the gathered information (train_id, date, passengers, passengers_info).
        e. **Confirmation**: After calling the booking function, confirm the booking success and provide the Order ID to the user.
    4.  **Other Tools**: Use `get_order_status` if the user asks about an existing order.
    """
    model = genai.GenerativeModel(
        model_name='gemini-flash-latest', 
        system_instruction=SYSTEM_INSTRUCTION,
        tools=tools
    )

except (ValueError, KeyError) as e:
    print(f"Error initializing GenerativeAI model: {e}")
    model = None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)