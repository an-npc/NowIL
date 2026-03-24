#test router
from fastapi import APIRouter
from models.test_model import Test
from database import get_session

router = APIRouter(prefix="/test", tags=["Test"])

@router.post("")
def test(body:Test):
    return {
        "name":Test.name,
        "number":Test.num,
        "isAlive": Test.alive
        }