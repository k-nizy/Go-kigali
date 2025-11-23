import requests
import time
import sys

API_URL = "http://localhost:5000/api/v1/simulation/vehicles/simulate"

def run_simulation():
    print(f"Starting simulation loop targeting: {API_URL}")
    print("Press Ctrl+C to stop")
    
    count = 0
    try:
        while True:
            try:
                response = requests.post(API_URL)
                if response.status_code == 200:
                    data = response.json()
                    print(f"[{count}] Moved {data.get('moved_count', 0)} vehicles")
                else:
                    print(f"[{count}] Error: {response.status_code} - {response.text}")
            except requests.exceptions.ConnectionError:
                print(f"[{count}] Connection error. Is the backend running?")
            except Exception as e:
                print(f"[{count}] Error: {e}")
            
            count += 1
            time.sleep(2) # Run every 2 seconds
            
    except KeyboardInterrupt:
        print("\nSimulation stopped")

if __name__ == "__main__":
    run_simulation()
