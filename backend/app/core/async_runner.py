
import asyncio

_loop = None

def set_loop(loop):
    global _loop
    _loop = loop

def run_async(coro):
    if _loop is None:
        raise RuntimeError("Event loop not initialized")
    return _loop.run_until_complete(coro)