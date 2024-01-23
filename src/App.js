import React, { useState } from 'react';
import './App.css';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [isEditing, setEditing] = useState(null);

  const addBlock = (blockType) => {
    const newBlock = {
      id: Date.now(),
      type: blockType,
      content: blockType === 'text' ? 'Type your text here...' : null,
    };

    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  const deleteBlock = (id) => {
    setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id));
  };

  const editBlock = (id) => {
    setEditing(id);
  };

  const saveEdit = (id, content) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === id ? { ...block, content: content } : block))
    );
    setEditing(null);
  };

  const rearrangeBlocks = (dragIndex, hoverIndex) => {
    const updatedBlocks = [...blocks];
    const draggedBlock = updatedBlocks[dragIndex];

    updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(hoverIndex, 0, draggedBlock);

    setBlocks(updatedBlocks);
  };

  const insertBlock = (index) => {
    const newBlock = {
      id: Date.now(),
      type: 'text',
      content: 'Type your text here...',
    };

    setBlocks((prevBlocks) => [...prevBlocks.slice(0, index), newBlock, ...prevBlocks.slice(index)]);
  };

  return (
    <div className="App">
      <div className="add-block-btn" onClick={() => addBlock('text')}>
        Add Text Block
      </div>
      <div className="add-block-btn" onClick={() => addBlock('picture')}>
        Add Picture Block
      </div>

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className={`block ${block.type}`}
          onMouseOver={() => setEditing(block.id)}
          onMouseLeave={() => setEditing(null)}
        >
          {block.type === 'text' ? (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => saveEdit(block.id, e.target.innerText)}
            >
              {block.content}
            </div>
          ) : (
            <img src={block.content} alt="Uploaded" />
          )}

          {isEditing === block.id && (
            <div className="edit-options">
              <button onClick={() => editBlock(block.id)}>Edit</button>
              <button onClick={() => deleteBlock(block.id)}>Delete</button>
            </div>
          )}

          <div
            className="drag-handle"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/html', null);
              e.dataTransfer.setDragImage(new Image(), 0, 0);
              e.dataTransfer.setData('index', index);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dragIndex = Number(e.dataTransfer.getData('index'));
              const hoverIndex = index;
              rearrangeBlocks(dragIndex, hoverIndex);
            }}
          >
        
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
