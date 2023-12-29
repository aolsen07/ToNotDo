/* modified from https://github.com/mdn/web-components-examples/blob/main/editable-list/main.js */
class ToNotDoList extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' });
        
        const container = document.createElement('div');

        const listItems = this.items;

        container.innerHTML = `
        <style>
        </style>
        <ul class="list">
            ${listItems.map(item => `
                <li>
                    <span class="item-text-content">${item}</span>
                    <button class="list-remove-item icon">&ominus;</button>
                </li>
            `).join('')}
        </ul>
        <div>
            <label for="add-new-item-input">Add an item:</label>
            <input id="add-new-item-input" class="add-new-item-input" type="text">
            <button class="list-add-item icon">Add</button>
        </div>
        `;

        // TODO Add helpers
        this.addItem = this.addItem.bind(this);
        this.handleListeners = this.handleListeners.bind(this);
        this.removeItem = this.removeItem.bind(this);
        shadow.appendChild(container);
    }

    connectedCallback() {
        console.log("Connected list!");

        const removeElementButtons = [...this.shadowRoot.querySelectorAll('.list-remove-item')];
        const addElementButton = this.shadowRoot.querySelector('.list-add-item');

        this.itemList = this.shadowRoot.querySelector('.list');

        this.handleListeners(removeElementButtons);
        addElementButton.addEventListener('click', this.addItem, false);
    }

    // modified to retrieve from localStorage on load
    get items() {
        let data = window.localStorage.getItem("list-items");
        if (!data) {
            return ["Item 1", "Item 2", "Item 3"];
        } else {
            return JSON.parse(data);
        }
        
    }

    addItem(e) {
        const input = this.shadowRoot.querySelector(".add-new-item-input");

        if (input.value) {
            const listItem = document.createElement('li');
            const span = document.createElement('span');
            const button = document.createElement('button');
            const childrenLength = this.itemList.children.length;

            span.textContent = input.value + ' ';

            button.classList.add('list-remove-item', 'icon');
            span.classList.add('item-text-content');
            button.innerHTML = "&ominus;";

            this.itemList.appendChild(listItem);
            this.itemList.children[childrenLength].appendChild(span);
            this.itemList.children[childrenLength].appendChild(button);

            this.handleListeners([button]);
            input.value = '';
            this.storeItems();
        }
    }

    handleListeners(arr) {
        arr.forEach(element => {
            element.addEventListener('click', this.removeItem, false);
        });
    }

    removeItem(e) {
        e.target.parentNode.remove();
        this.storeItems();
    }

    storeItems() {
        let listData = this.shadowRoot.querySelectorAll(".item-text-content");
        console.log(listData);
        let toStore = []
        listData.forEach(element => {
            toStore.push(element.textContent);
        });
        localStorage.setItem('list-items', JSON.stringify(toStore));
        console.log("Storage updated");
    } 
}

customElements.define('tonotdo-list', ToNotDoList)