---
title: Getting Product details from the web
label: epic-4-routing
---

As a user, I want to add external data to my items by using API data and selecting the right product, so that I have more information.

![](../../../../../bfritscher/cours-vue-github-project-creator/blob/vue-intro/data/assets/vue-fetch.png?raw=true)

### New Concepts

- **`fetch` API:** A modern interface for fetching resources across the network.
- **`async/await`:** Syntax for handling asynchronous operations.

### Acceptance Criteria

- [ ] On the item detail page, there is a feature to search for product information online.
- [ ] The application fetches data from the Open Food Facts API using the item's name as a search query.
- [ ] A loading indicator is shown while the API request is in progress.
- [ ] The results of the API search are displayed to the user.

<details>
<summary>Hints</summary>

- [ ] Use the Open Food Facts API to search for products. Here's an example function:
  ```js
  async function fetchProductDetails(productName) {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${productName}&lc=fr&countries=Switzerland&search_simple=1&json=1&page_size=20&fields=product_name,quantity,product_type,brands,categories,code,nutriments,nutriscore,url,image_url`,
    );
    const data = await response.json();
    return data;
  }
  ```
- [ ] On the details page, create a button to fetch results using the item name as input.
- [ ] Display a loading indicator (e.g., a Bootstrap spinner) while fetching data.
- [ ] Disable the button while loading to prevent multiple requests.
- [ ] Don't forget to add an `id` to the received items if one is not provided by the API.
</details>
