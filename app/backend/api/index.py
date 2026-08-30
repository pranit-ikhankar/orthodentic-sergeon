import sys
from pathlib import Path

# Add backend directory to sys.path so server.py can be imported
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from server import app

__all__ = ["app"]
