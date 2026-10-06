from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.config import settings

# Create MongoDB client
client = AsyncIOMotorClient(settings.mongodb_url)

# Select the application database
database = client[settings.database_name]


def get_database():
    """Return the MongoDB database instance."""
    return database


async def check_database_connection():
    """Check whether MongoDB is reachable."""
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False


def close_database():
    """Close the MongoDB connection."""
    client.close()