from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import urllib.parse

load_dotenv()

password = urllib.parse.quote_plus(os.getenv("DB_PASSWORD", ""))
DATABASE_URL = (
    f"postgresql+psycopg2://{os.getenv('DB_USER')}:{password}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
