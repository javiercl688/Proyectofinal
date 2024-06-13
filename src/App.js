import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  max-width: 90%;
  margin: 50px auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
    margin: 20px auto;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  background-color: #fff;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  width: calc(100% - 110px);
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: calc(100% - 70px);
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;

const IconButton = styled.button`
  padding: 10px;
  background-color: transparent;
  color: #333;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  margin-left: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
  }
`;

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost/partes.php');
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    try {
      const response = await axios.post('http://localhost/partes.php', { name: newItem });
      setItems([...items, response.data]);
      setNewItem('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost/partes.php?id=${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditingText(item.name);
  };

  const saveItem = async (id) => {
    try {
      const response = await axios.put('http://localhost/partes.php', { id, name: editingText });
      setItems(items.map(item => (item.id === id ? response.data : item)));
      setEditingItem(null);
      setEditingText('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  return (
    <Container>
      <Title>Elementos</Title>
      <List>
        {items.map(item => (
          <ListItem key={item.id}>
            {editingItem === item.id ? (
              <>
                <Input
                  type="text"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                />
                <SaveButton onClick={() => saveItem(item.id)}>
                  <FontAwesomeIcon icon={faSave} />
                </SaveButton>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <div>
                  <IconButton onClick={() => startEditing(item)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton onClick={() => deleteItem(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </div>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <div>
        <Input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Agregar nuevo elemento"
        />
        <Button onClick={addItem}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
    </Container>
  );
}

export default App;
