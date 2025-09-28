#!/usr/bin/env python3
"""
Development runner for LLM Playground
This script ensures the virtual environment is properly set up and starts the Flask server
"""

import os
import sys
import subprocess
import platform

def check_virtual_env():
    """Check if we're running in a virtual environment"""
    return hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)

def get_activation_script():
    """Get the appropriate activation script for the current platform"""
    if platform.system() == "Windows":
        return "venv\\Scripts\\activate"
    else:
        return "venv/bin/activate"

def main():
    """Main function to run the development server"""
    print("🚀 LLM Playground Development Server")
    print("=" * 40)
    
    # Check if virtual environment exists
    venv_path = os.path.join(os.getcwd(), "venv")
    if not os.path.exists(venv_path):
        print("❌ Virtual environment not found!")
        print("Please run: python3 -m venv venv")
        sys.exit(1)
    
    # Check if we're in virtual environment
    if not check_virtual_env():
        print("⚠️  Not running in virtual environment")
        print("Activating virtual environment...")
        
        # Get the Python executable from the virtual environment
        if platform.system() == "Windows":
            python_exe = os.path.join(venv_path, "Scripts", "python.exe")
        else:
            python_exe = os.path.join(venv_path, "bin", "python")
        
        if not os.path.exists(python_exe):
            print("❌ Virtual environment Python not found!")
            sys.exit(1)
        
        # Re-run this script with the virtual environment Python
        subprocess.run([python_exe, __file__] + sys.argv[1:])
        return
    
    print("✅ Running in virtual environment")
    
    # Check if required packages are installed
    try:
        import flask
        import flask_cors
        print("✅ Required packages found")
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Installing requirements...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Start the Flask application
    print("🌐 Starting Flask development server...")
    print("📍 URL: http://localhost:5000")
    print("🔄 Auto-reload enabled")
    print("🛑 Press Ctrl+C to stop")
    print("-" * 40)
    
    try:
        from app import app
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            use_reloader=True,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()