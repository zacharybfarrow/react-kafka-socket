import json
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()
transcript = []


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        data_dict = json.loads(data)
        print(data_dict)
        ## db operation to store chat message in db
        ## get the list of chat message from the database
        if data_dict["data"] == "close":
            transcript.clear()
            await websocket.close()
            return
        transcript.append(data_dict)
        await websocket.send_json(transcript)
