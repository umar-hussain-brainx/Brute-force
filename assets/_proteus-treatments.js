window.addEventListener('DOMContentLoaded', () => {

  // redirect free sand
  if(window.location.href.indexOf("/products/free-weighted-filler") > -1){
    window.location.href = "/";
  }

  const disable_free_sand_qty_selectors = () => {
    console.log("disable_free_sand_qty_selectors()");
    // on /cart page cannot +/- free sand
    waitForElement('.cart__item-title > a[href*="/products/free-weighted-filler"]').then(() => {
      let free_sand_items = document.querySelectorAll('.cart__item-title > a[href*="/products/free-weighted-filler"]');
      for(let i = 0; i < free_sand_items.length; i++){
        let qty_selector = free_sand_items[i].parentNode.parentNode.querySelector('.cart__item-sub .js-qty__wrapper');

        qty_selector.insertAdjacentHTML("afterend", `<div style="padding:5px 20px; border:1px solid #e8e8e1;">${qty_selector.querySelector('input').value}</div>`);
        qty_selector.remove();

      }
    }).catch();
  };

  // on /cart page cannot +/- free sand
  waitForElement('.cart__page').then(() => {
    disable_free_sand_qty_selectors();
  }).catch();

  // update announcement bar
  waitUntil(() => {
    return window.sessionStorage.getItem("free_sand_in_cart");
  }).then(() => {
    waitForElement('#fsb_bar').then(el => {
      el.innerText = "CONGRATULATIONS! Your sand will be added for FREE!";
    }).catch();
  }).catch();

  const sandbags = [
    {
      v1: 40946111709368,
      v2: 40946571051192,
      title: "One 30lb Bag of Sand",
      price: "$40"
    },
    {
      v1: 40946111742136,
      v2: 40946571083960,
      title: "One 50lb Bag of sand",
      price: "$45"
    },
    {
      v1: 40946111774904,
      v2: 40946571116728,
      title: "Two 50lb Bags of Sand",
      price: "$65"
    },
    {
      v1: 41375964102840 ,
      v2: 41375964102840 ,
      title: "Weighted Vest Fillers",
      price: "$65"
    }
  ];

  /*
  Mini/Scout | 15-30lbs
  Athlete | 25-75lbs
  Strongman | 75-135lbs
  Spartan | 125-200lbs

  5-10lbs
  15-30lbs
  30-45lbs
  */

  const get_upsell_index = (variant_name) => {
    
    if(window.location.href.indexOf("weighted-training-vest-2-0") > -1){
      return 3;
    }
    
    if(variant_name.indexOf("Mini") > -1 || variant_name.indexOf("Scout") > -1){
      return 0;
    } else if(variant_name.indexOf("Athlete") > -1){
      return 1;
    } else if(variant_name.indexOf("Strongman") > -1){
      return 2;
    } else if(variant_name.indexOf("Spartan") > -1){
      return 2;
    } else {
      return 99;
    }
  };

  waitUntil(() => {
    return window.sessionStorage.getItem("BF-05") || getParam("qa").indexOf("bf05") > -1;
  }).then(() => {

    initExperiment("BF-05", "v0.01");

    if(window.location.href.indexOf("sandbag") > -1 || window.location.href.indexOf("weighted-training-vest-2-0") > -1){

      waitForElement('fieldset[name="Color"]').then(color => {
        waitForElement('fieldset[name="Size"]').then(size => {
          
          let upsell_index = get_upsell_index(document.querySelector('input[name="Size"]:checked').value);

          waitForElement('.payment-buttons').then(atc => {
            atc.insertAdjacentHTML("beforebegin", `
              <div id="js-pdp-upsell"></div>
            `);

            waitForElement('#js-pdp-upsell').then(upsell => {

              const update_upsell_checkbox = () => {
                
                console.log("update_upsell_checkbox()");
                upsell_index = get_upsell_index(document.querySelector('input[name="Size"]:checked').value);
                
                if(window.location.href.indexOf("weighted-training-vest-2-0") > -1){
                  document.querySelector('#js-pdp-upsell').innerHTML = `
                  <div class="js-pdp-upsell--title">
                    No time to lose? We can pre-fill your vest for you.
                  </div>

                  <label class="js-label">
                    Add ${sandbags[upsell_index].title} - ${sandbags[upsell_index].price}
                    <input type="checkbox" data-upsell-variant-id="${sandbags[upsell_index].v1}">
                    <span class="checkmark"></span>
                  </label>
                  `;
                } else {
                  document.querySelector('#js-pdp-upsell').innerHTML = `
                  <div class="js-pdp-upsell--title">
                    No time to lose? We can pre-fill your bag for you.
                  </div>

                  <label class="js-label">
                    Add ${sandbags[upsell_index].title} - ${sandbags[upsell_index].price}
                    <input type="checkbox" data-upsell-variant-id="${sandbags[upsell_index].v1}">
                    <span class="checkmark"></span>
                  </label>
                  `;
                }

              };
              

              //init
              update_upsell_checkbox();

              const process_upsell_checkbox = () => {
                let upsell_id = document.querySelector('#js-pdp-upsell input[type="checkbox"]').getAttribute("data-upsell-variant-id");

                if(document.querySelector('#js-pdp-upsell input[type="checkbox"]').checked){
                  console.log("ATC", upsell_id);
                  cart_add_item(upsell_id, 1);
                }

                //update cart
                setTimeout(() => {
                  let cart = new theme.CartDrawer;
                  cart.init();
                  // cart.open();
                  update_upsell_checkbox();
                }, 250);
              };

              /*
              let item_count = 0;
              document.addEventListener('cart:updated', function(event) {
                var cart = event.detail.cart;

                console.log("CART CHANGE", cart.item_count, item_count);

                if(cart.item_count > item_count){

                  item_count = cart.item_count;
                }
              });
              */

              atc.addEventListener("click", () => {
                setTimeout(() => {
                  process_upsell_checkbox();
                }, 500)
              });

              color.addEventListener("change", () => {
                console.log("--color change");
                update_upsell_checkbox();
              });

              size.addEventListener("change", () => {
                console.log("--size change");
                update_upsell_checkbox();
              });

            }).catch();
          }).catch();
        }).catch();
      }).catch();

    }

  }).catch();

  waitUntil(() => {
    return window.sessionStorage.getItem("BF-04") || getParam("qa").indexOf("bf04") > -1;
  }).then(() => {

    initExperiment("BF-04", "v0.01");
    if(window.sessionStorage.getItem("BF-04")){
      variation = window.sessionStorage.getItem("BF-04");
    }

    const apply_upsell_treatment = () => {
      console.log("apply_upsell_treatment()");

      // product tags are mapped to .cart__item element in ajax cart via theme file /snippets/cart-item.liquid

      let sand_available_0, sand_available_1, sand_available_2;

      let cart_contents = document.querySelectorAll('.cart__items .cart__item');

      //reset count
      sand_available_0 = 0;
      sand_available_1 = 0;
      sand_available_2 = 0;

      for(let i = 0; i < cart_contents.length; i++){
        let item_classList = cart_contents[i].classList.value;
        let item_qty = parseInt(cart_contents[i].getAttribute("data-count"));
        let prod_id = cart_contents[i].getAttribute("data-var-id");
        if(item_classList.indexOf("sandbag") > -1){
          if(item_classList.indexOf("mini") > -1 || item_classList.indexOf("scout") > -1){
            sand_available_0 = sand_available_0 + item_qty
          } else if(item_classList.indexOf("athlete") > -1){
            sand_available_1 = sand_available_1 + item_qty
          } else if(item_classList.indexOf("strongman") > -1){
            sand_available_2 = sand_available_2 + item_qty
          }
        }

        if(item_classList.indexOf("free-filler") > -1){
          disable_free_sand_qty_selectors();
          window.sessionStorage.setItem("free_sand_in_cart", true);
          waitForElement('#fsb_bar').then(el => {
            el.innerText = "CONGRATULATIONS! Your sand will be added for FREE!";
          }).catch();
        }

        if(item_classList.indexOf("filler") > -1){
          if(prod_id == 40946111709368 || prod_id ==  40946571051192){
            sand_available_0 = sand_available_0 - item_qty;
          } else if(prod_id == 40946111742136 || prod_id ==  40946571083960){
            sand_available_1 = sand_available_1 - item_qty;
          } else if(prod_id == 40946111774904 || prod_id ==  40946571116728){
            sand_available_2 = sand_available_2 - item_qty;
          }
        }

        let variants_info = cart_contents[i].querySelector('.cart__item--variants');
        let prod_size = variants_info.innerText.slice(6, variants_info.innerText.indexOf("\n"));
        prod_size = prod_size.slice(prod_size.indexOf("-"));
        prod_size = prod_size.slice(1);

        let upsell_index;

        if(prod_size == "25lbs" || prod_size == "30lbs"){
          //offer 25lb
          if(sand_available_0 > 0){
            upsell_index = 0;
          } else {
            upsell_index = 99;
          }
        } else if(prod_size == "75lbs"){
          //offer 2 pack 50lb
          if(sand_available_1 > 0){
            upsell_index = 1;
          } else {
            upsell_index = 99;
          }
        } else if(prod_size == "135lbs"){
          //offer 2 pack 50lb
          if(sand_available_2 > 0){
            upsell_index = 2;
          } else {
            upsell_index = 99;
          }
        } else {
          // exclude spartan
          upsell_index = 99;
        }

        if(upsell_index < 99){
          if(variation === "v1"){
            cart_contents[i].insertAdjacentHTML("afterend", `
              <div class="js-atc-sand" data-upsell-variant-id="${sandbags[upsell_index].v1}">
                No time to lose? We can pre-fill your bag for you.
                <div>Add ${sandbags[upsell_index].title} - ${sandbags[upsell_index].price}</div>
              </div>
            `);
          }

          if(variation === "v2"){
            cart_contents[i].insertAdjacentHTML("afterend", `
              <div class="js-atc-sand" data-upsell-variant-id="${sandbags[upsell_index].v2}">
                No time to lose? We'll pre-fill your bag free!
                <div>Add ${sandbags[upsell_index].title}</div>
                <small>Sand is added <strong>FREE</strong> you just pay shipping.</small>
              </div>
            `);
          }
        }

        if(i === cart_contents.length - 1){
          console.log(`${sand_available_0} -- ${sand_available_1} -- ${sand_available_2}`);

          let upsell_items = document.querySelectorAll('.js-atc-sand');
          for(let ii = 0; ii < upsell_items.length; ii++){
            upsell_items[ii].addEventListener("click", (e) => {
              let var_id = e.target.closest('.js-atc-sand').getAttribute("data-upsell-variant-id");
              cart_add_item(var_id, 1);
              setTimeout(() => {
                rebuild_cart();
              }, 1000);
            })
          }

          if(sand_available_0 > 0 || sand_available_1 > 0 || sand_available_2 > 0){

          }
        }
      }

    };

    const teardown_upsell_treatment = () => {
      console.log("teardown_upsell_treatment()");
      let upsell_items = document.querySelectorAll('.js-atc-sand');
      for(let i = 0; i < upsell_items.length; i++){
        upsell_items[i].remove();
      }
    };

    // refresh cart and rebuild upsell
    const rebuild_treatment = () => {
      console.log("rebuild_treatment()");
      teardown_upsell_treatment();
      setTimeout(() => {
        apply_upsell_treatment();
      }, 1000);
    };

    // refresh cart and rebuild upsell
    const rebuild_cart = () => {
      console.log("rebuild_cart()");
      let cart = new theme.CartDrawer;
      cart.init();
      cart.open();
      rebuild_treatment();
    };

    observeSelector('#CartDrawer.drawer--is-open', cart => {
      rebuild_treatment();
    });


    let current_item_count, new_item_count;
    document.addEventListener('cart:updated', function(event) {

      let cart = event.detail.cart;
      new_item_count = cart.item_count;

      if(current_item_count != new_item_count){
        current_item_count = cart.item_count;
        rebuild_treatment();
        console.log("cart updated...");
      }

    });

    /*
    document.addEventListener('variant:added', function(event) {
      // var variant = event.detail.variant; // Get the variant that was added
      console.log("variant added...");
      apply_upsell_treatment();
    });
    */

  }).catch();

});
