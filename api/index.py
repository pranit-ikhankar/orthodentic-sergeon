import sys
from pathlib import Path

# Add project root and backend folder to Python sys.path
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "app" / "backend"

sys.path.insert(0, str(root_dir))
sys.path.insert(0, str(backend_dir))

# Import the FastAPI instance
from app.backend.server import app

# Export for Vercel Serverless Function runtime
__all__ = ["app"]
