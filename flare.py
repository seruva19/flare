import argparse
import json
import os
import uvicorn
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from flare_server.model import FlareRequest
from flare_server.server import FlareServer

app = FastAPI()

flare = FlareServer(app)
flare.register_all_plugins()

app.flare = flare

frontend_dir = f"{Path(__file__).parent}/build"
app.mount("/client", StaticFiles(directory=frontend_dir), name="client")


@app.get("/")
def read_root():
    return FileResponse(f"{frontend_dir}/index.html")


@app.get("/environment")
def read_environment():
    return json.dumps(app.flare.get_environment_info())


@app.post("/flare")
def request_operation(request: FlareRequest):
    response = app.flare.route(request)
    return response


def start(args=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--dev", action=argparse.BooleanOptionalAction)
    args = parser.parse_args(args)

    uvicorn.run(
        "flare:app",
        host="0.0.0.0",
        port=8000,
        reload=args.dev,
        reload_dirs=[os.getcwd(), "plugins", "flare_server"],
    )
