import os
import sys

# Ensure backend package is discoverable when deployed on Vercel
current_dir = os.path.dirname(__file__)
backend_path = os.path.join(current_dir, "..", "backend")
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app import create_app  # noqa: E402

app = create_app(os.getenv("FLASK_ENV", "production"))
