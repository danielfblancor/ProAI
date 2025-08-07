import sys
from pathlib import Path

import pytest

sys.path.append(str(Path(__file__).resolve().parents[1]))
import app as flask_app


@pytest.fixture(autouse=True)
def setup(tmp_path):
    flask_app.DB_PATH = tmp_path / "test.db"
    flask_app.init_db()
    yield


def get_items(client):
    response = client.get('/')
    return response.data.decode('utf-8')


def test_add_item():
    client = flask_app.app.test_client()
    client.post('/add', data={'name': 'manzana', 'quantity': '5'})
    page = get_items(client)
    assert 'manzana' in page
    assert '5' in page


def test_update_and_delete_item():
    client = flask_app.app.test_client()
    client.post('/add', data={'name': 'pera', 'quantity': '3'})
    # update
    with flask_app.sqlite3.connect(flask_app.DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute('SELECT id FROM items WHERE name = ?', ('pera',))
        item_id = cur.fetchone()[0]
    client.post(f'/update/{item_id}', data={'quantity': '10'})
    page = get_items(client)
    assert '10' in page
    # delete
    client.post(f'/delete/{item_id}')
    page = get_items(client)
    assert 'pera' not in page
