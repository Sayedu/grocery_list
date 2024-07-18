document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('grocery-form');
    const itemInput = document.getElementById('item');
    const quantityInput = document.getElementById('quantity');
    const groceryList = document.getElementById('grocery-list');
    const itemIdInput = document.getElementById('item-id');
    let isEditMode = false;

    // Fetch and display the grocery list on page load
    fetch('/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => addItemToDOM(item));
        });

    // Add item event
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newItem = {
            item: itemInput.value,
            quantity: parseInt(quantityInput.value)
        };

        if (isEditMode) {
            // Update item
            const id = itemIdInput.value;
            fetch(`/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            })
            .then(response => response.json())
            .then(data => {
                updateItemInDOM(data);
                resetForm();
            })
            .catch(err => console.error(err));
        } else {
            // Add new item
            fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            })
            .then(response => response.json())
            .then(data => {
                addItemToDOM(data);
                resetForm();
            })
            .catch(err => console.error(err));
        }
    });

    // Add item to DOM
    function addItemToDOM(item) {
        const li = document.createElement('li');
        li.setAttribute('data-id', item._id);
        li.innerHTML = `<span>${item.item} (${item.quantity})</span>
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>`;
        groceryList.appendChild(li);

        // Add delete event
        li.querySelector('.delete').addEventListener('click', () => {
            deleteItem(item._id);
        });

        // Add edit event
        li.querySelector('.edit').addEventListener('click', () => {
            editItem(item);
        });
    }

    // Delete item
    function deleteItem(id) {
        fetch(`/products/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            document.querySelector(`[data-id='${id}']`).remove();
        })
        .catch(err => console.error(err));
    }

    // Edit item
    function editItem(item) {
        isEditMode = true;
        itemIdInput.value = item._id;
        itemInput.value = item.item;
        quantityInput.value = item.quantity;
        form.querySelector('button').textContent = 'Update Item';
    }

    // Update item in DOM
    function updateItemInDOM(updatedItem) {
        const itemElement = document.querySelector(`[data-id='${updatedItem._id}']`);
        itemElement.querySelector('span').textContent = `${updatedItem.item} (${updatedItem.quantity})`;
    }

    // Reset form
    function resetForm() {
        isEditMode = false;
        itemIdInput.value = '';
        itemInput.value = '';
        quantityInput.value = '';
        form.querySelector('button').textContent = 'Add Item';
    }
});
