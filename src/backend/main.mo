import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";



actor {
  include MixinStorage();

  public type Product = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
    category : Text;
    bestseller : Bool;
    createdAt : Time.Time;
  };

  public type OrderItem = {
    productId : Text;
    title : Text;
    quantity : Nat;
    price : Nat;
  };

  public type CustomerInfo = {
    fullName : Text;
    email : Text;
    phone : Text;
    address : Text;
    city : Text;
    postalCode : Text;
    country : Text;
  };

  public type Order = {
    id : Text;
    customerInfo : CustomerInfo;
    items : [OrderItem];
    subtotal : Nat;
    shippingAmount : Nat;
    total : Nat;
    status : Text;
    createdAt : Time.Time;
  };

  public type CustomOrderRequest = {
    id : Text;
    productType : Text;
    colorPreference : Text;
    size : Text;
    description : Text;
    inspirationImage : Storage.ExternalBlob;
    budgetRange : Text;
    email : Text;
    createdAt : Time.Time;
  };

  public type ReturnRequest = {
    orderNumber : Text;
    customerName : Text;
    email : Text;
    reason : Text;
    message : Text;
    video : Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  public type WishlistItem = {
    email : Text;
    productId : Text;
    addedAt : Time.Time;
  };

  // Admin Passcode
  let adminPasscode = "knotankey_admin_2026";

  // Persisted stable state
  var products = Map.empty<Text, Product>();
  var orders = Map.empty<Text, Order>();
  var customOrderRequests = Map.empty<Text, CustomOrderRequest>();
  var returnRequests = Map.empty<Text, ReturnRequest>();
  var wishlist = Map.empty<Text, List.List<WishlistItem>>();
  var categories = Set.empty<Text>();

  // Product CRUD Operations
  public shared ({ caller }) func createProduct(passcode : Text, product : Product) : async () {
    requireAdmin(passcode);
    products.add(product.id, product);
    categories.add(product.category);
  };

  public shared ({ caller }) func updateProduct(passcode : Text, product : Product) : async () {
    requireAdmin(passcode);
    products.add(product.id, product);
    categories.add(product.category);
  };

  public shared ({ caller }) func deleteProduct(passcode : Text, productId : Text) : async () {
    requireAdmin(passcode);
    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_product) {
        products.remove(productId);
      };
    };
  };

  public shared ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func getProductById(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func filterProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        Text.equal(product.category, category);
      }
    );
  };

  public shared ({ caller }) func getBestSellers() : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.bestseller;
      }
    );
  };

  // Category Management
  public shared ({ caller }) func getCategories() : async [Text] {
    categories.toArray();
  };

  public shared ({ caller }) func addCategory(passcode : Text, category : Text) : async () {
    requireAdmin(passcode);
    categories.add(category);
  };

  public shared ({ caller }) func removeCategory(passcode : Text, category : Text) : async () {
    requireAdmin(passcode);
    categories.remove(category);
  };

  // Orders
  public shared ({ caller }) func createOrder(order : Order) : async Text {
    orders.add(order.id, order);
    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(passcode : Text, orderId : Text, status : Text) : async () {
    requireAdmin(passcode);
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func getOrders(passcode : Text) : async [Order] {
    requireAdmin(passcode);
    orders.values().toArray();
  };

  public shared ({ caller }) func getOrderById(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  // Custom Orders
  public shared ({ caller }) func createCustomOrderRequest(request : CustomOrderRequest) : async () {
    customOrderRequests.add(request.id, request);
  };

  public shared ({ caller }) func getCustomOrderRequests(passcode : Text) : async [CustomOrderRequest] {
    requireAdmin(passcode);
    customOrderRequests.values().toArray();
  };

  // Returns
  public shared ({ caller }) func createReturnRequest(orderNumber : Text, customerName : Text, email : Text, reason : Text, message : Text, video : Storage.ExternalBlob) : async () {
    let newRequest : ReturnRequest = {
      orderNumber;
      customerName;
      email;
      reason;
      message;
      video;
      createdAt = Time.now();
    };
    returnRequests.add(orderNumber, newRequest);
  };

  public shared ({ caller }) func getReturnRequests(passcode : Text) : async [ReturnRequest] {
    requireAdmin(passcode);
    returnRequests.values().toArray();
  };

  // Wishlist
  public shared ({ caller }) func addToWishlist(email : Text, productId : Text) : async () {
    let wishlistItem : WishlistItem = {
      email;
      productId;
      addedAt = Time.now();
    };
    let currentWishlist = switch (wishlist.get(email)) {
      case (null) { List.empty<WishlistItem>() };
      case (?items) { items };
    };
    currentWishlist.add(wishlistItem);
    wishlist.add(email, currentWishlist);
  };

  public shared ({ caller }) func getWishlist(email : Text) : async [WishlistItem] {
    switch (wishlist.get(email)) {
      case (null) { [] };
      case (?items) { items.toArray() };
    };
  };

  public shared ({ caller }) func removeFromWishlist(email : Text, productId : Text) : async () {
    switch (wishlist.get(email)) {
      case (null) { Runtime.trap("Wishlist not found") };
      case (?items) {
        let updatedItems = items.filter(
          func(item) {
            not Text.equal(item.productId, productId);
          }
        );
        wishlist.add(email, updatedItems);
      };
    };
  };

  func requireAdmin(passcode : Text) {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
  };
};
