(() => {
    let currentIndex = 0;
    let productsData = [];

    const init = async () => {
        if (document.getElementsByClassName('product-detail').length) {
            await fetchProducts();
            buildHTML();
            buildCSS();
            setEvents();
            loadFavorites();
        }
    };

    const fetchProducts = () => {
        if (localStorage.getItem("products")) {
            productsData = JSON.parse(localStorage.getItem("products"));

            return localStorage.getItem("products")
        }

        return fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("products", JSON.stringify(data));
                productsData = data;

                return data;
            });
    };

    const buildHTML = () => {
        let html = `
        <h1>You Might Also Like</h1>
            <div class="carousel-container">
                <div class="carousel-track">
        `;

        productsData.forEach((product) => {
            const imageSrc = product.img ? product.img : 'https://placehold.co/250x250?text=No+Image';
            const productName = product.name ? product.name : 'Ürün Adı';
            const productUrl = product.url ? product.url : '#';
            const productPrice = product.price !== undefined ? product.price : '0.00';

            html += `
                <div class="carousel-item" data-id="${product.id}">
                    <div class="favorite-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <a href="${productUrl}" target="_blank">
                        <div class="product-image">
                            <img src="${imageSrc}" alt="${productName}"/>
                        </div>
                    </a>
                    <div class="product-info">
                        <h3 class="product-name">${productName}</h3>
                        <p class="product-price">Fiyat: $${productPrice}</p>
                    </div>
                </div>`;
        });

        html += `
            </div>
                <div class="carousel-nav carousel-prev">&lt;</div>
                <div class="carousel-nav carousel-next">&gt;</div>
            </div>`;

        document.getElementsByClassName('product-detail')[0].insertAdjacentHTML('afterend', html);
    };

    const buildCSS = () => {
        const css = `
        .carousel-container {
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            overflow: hidden;
            padding: 10px 0;
        }
        .carousel-track {
            display: flex;
            gap: 10px; 
            transition: transform 0.3s ease;
        }
        .carousel-item {
            min-width: 200px;
            flex: 0 0 calc(20% - 10px); 
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            overflow: hidden;
            text-align: center;
        }
        .favorite-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 15%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .favorite-btn svg {
            width: 20px;
            height: 20px;
            fill: #888;
            transition: fill 0.3s ease;
        }
        .favorite-btn.active {
            background-color: rgba(0, 0, 255, 0.7);
        }
        .favorite-btn.active svg {
            fill: blue;
        }
        .carousel-item {
            position: relative;
            text-align: center;
        }
        .product-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        .product-info {
            padding: 10px;
        }
        .product-name {
            font-size: 1.3rem;
            font-weight: bold;
            text-align: left;
        }
        .product-price {
            font-size: 1.2rem;
            color: blue;
            font-weight: bold;
            text-align: left;
        }
        .carousel-nav {
            position: absolute;
            top: 52%; 
            transform: translateY(-50%);
            font-size: 3rem;
            cursor: pointer;
            user-select: none;
            padding: 0; 
            background: none; 
            color: black; 
            border: none;
        }
        .carousel-prev {
            left: 5px;
        }
        .carousel-next {
            right: 5px;
        }
        @media (max-width: 1024px) {
            .carousel-item {
                flex: 0 0 calc(25% - 10px); 
            }
        }
        @media (max-width: 768px) {
            .carousel-item {
                flex: 0 0 calc(50% - 10px); 
            }
            .carousel-nav {
                font-size: 1.3rem;
                padding: 8px;
            }
        }
        @media (max-width: 480px) {
            .carousel-item {
                flex: 0 0 100%; 
            }
            .carousel-nav {
                font-size: 1.2rem;
                padding: 6px;
            }
        }`;

        const styleEl = document.createElement('style');

        styleEl.className = 'carousel-style';
        styleEl.innerText = css;
        document.head.appendChild(styleEl);
    };

    const toggleFavorite = (element, productId) => {
        element.classList.toggle("active");

        const favorites = JSON.parse(localStorage.getItem("favorites")) || {};

        if (favorites[productId]) {
            delete favorites[productId];
        } else {
            favorites[productId] = true;
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    };

    const loadFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || {};

        document.querySelectorAll(".carousel-item").forEach(item => {
            const productId = item.getAttribute("data-id");
            const favButton = item.querySelector(".favorite-btn");

            if (favorites[productId]) {
                favButton.classList.add("active");
            }
        });
    };

    const setEvents = () => {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                moveCarousel('prev');
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                moveCarousel('next');
            });
        }

        document.querySelectorAll('.favorite-btn').forEach((element) => {
            element.addEventListener('click', (event) => {
                const productId = event.currentTarget.closest('.carousel-item').getAttribute('data-id');

                toggleFavorite(event.currentTarget, productId);
            });
        });
    };

    const moveCarousel = (direction) => {
        const track = document.querySelector('.carousel-track');
        const items = document.querySelectorAll('.carousel-item');

        if (!track || items.length === 0) {
            return;
        }

        const item = items[0];
        const itemStyle = window.getComputedStyle(item);
        const marginLeft = parseFloat(itemStyle.marginLeft);
        const marginRight = parseFloat(itemStyle.marginRight);
        const itemWidth = item.offsetWidth + marginLeft + marginRight;
        const container = document.querySelector('.carousel-container');
        const containerWidth = container.offsetWidth;
        const itemsPerView = Math.floor(containerWidth / itemWidth);

        if (direction === 'prev') {
            currentIndex = Math.max(currentIndex - 1, 0);
        } else {
            const maxIndex = items.length - itemsPerView;

            currentIndex = Math.min(currentIndex + 1, maxIndex);
        }

        const newTranslateX = -currentIndex * (itemWidth + 10);

        track.style.transform = `translateX(${newTranslateX}px)`;
    };

    init();
})();