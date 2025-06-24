from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import urllib.parse

load_dotenv()

password = urllib.parse.quote_plus(os.getenv("DB_PASSWORD", ""))
db_host = os.getenv('DB_HOST')

if db_host.startswith('/cloudsql/'):
    DATABASE_URL = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{password}@/{os.getenv('DB_NAME')}?host={db_host}"
else:
    DATABASE_URL = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{password}@{db_host}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
