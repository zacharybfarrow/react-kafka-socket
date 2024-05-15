import json
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from websockets import broadcast

app = FastAPI()
transcript = []
connections = set()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            data_dict = json.loads(data)
            print(data_dict)
            if data_dict["data"] == "close":
                transcript.clear()
                break
            transcript.append(data_dict)
            for conn in connections:
                await conn.send_json(transcript)
    except Exception as e:
        import traceback

        print(f"An error occurred: {e}")
        traceback.print_exc()
        await websocket.send_text("Error: An unexpected error occurred")

    finally:
        connections.remove(websocket)
        await websocket.close()
        print(connections.__len__())
