import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

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

  public type Order = {
    id : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    shippingAddress : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
    items : [OrderItem];
    totalPrice : Nat;
    orderDate : Time.Time;
    orderStatus : Text;
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

  public type OrderItem = {
    productId : Text;
    title : Text;
    quantity : Nat;
    price : Nat;
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

  var products = Map.empty<Text, Product>();
  var orders = Map.empty<Text, Order>();
  var customOrderRequests = Map.empty<Text, CustomOrderRequest>();
  var returnRequests = Map.empty<Text, ReturnRequest>();
  var wishlist = Map.empty<Text, List.List<WishlistItem>>();
  var categories = Set.empty<Text>();

  // Product CRUD Operations
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product.id, product);
    categories.add(product.category);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
    categories.add(product.category);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_product) {
        products.remove(productId);
      };
    };
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductById(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Category Management
  public query func getCategories() : async [Text] {
    categories.toArray();
  };

  public shared ({ caller }) func addCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    categories.add(category);
  };

  public shared ({ caller }) func removeCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove categories");
    };
    categories.remove(category);
  };

  // Orders
  public shared func createOrder(order : Order) : async Text {
    orders.add(order.id, order);
    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with orderStatus = status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query func getOrderById(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  // Custom Orders
  public shared ({ caller }) func createCustomOrderRequest(request : CustomOrderRequest) : async () {
    customOrderRequests.add(request.id, request);
  };

  public shared ({ caller }) func getCustomOrderRequests() : async [CustomOrderRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view custom order requests");
    };
    customOrderRequests.values().toArray();
  };

  // Returns
  public shared func createReturnRequest(orderNumber : Text, customerName : Text, email : Text, reason : Text, message : Text, video : Storage.ExternalBlob) : async () {
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

  public shared ({ caller }) func getReturnRequests() : async [ReturnRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view return requests");
    };
    returnRequests.values().toArray();
  };

  // Wishlist
  public shared ({ caller }) func addToWishlist(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlists");
    };
    let key = caller.toText();
    let wishlistItem : WishlistItem = {
      email = key;
      productId;
      addedAt = Time.now();
    };
    let currentWishlist = switch (wishlist.get(key)) {
      case (null) { List.empty<WishlistItem>() };
      case (?items) { items };
    };
    currentWishlist.add(wishlistItem);
    wishlist.add(key, currentWishlist);
  };

  public query ({ caller }) func getWishlist() : async [WishlistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wishlists");
    };
    let key = caller.toText();
    switch (wishlist.get(key)) {
      case (null) { [] };
      case (?items) { items.toArray() };
    };
  };

  public shared ({ caller }) func removeFromWishlist(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlists");
    };
    let key = caller.toText();
    switch (wishlist.get(key)) {
      case (null) { Runtime.trap("Wishlist not found") };
      case (?items) {
        let updatedItems = items.filter(
          func(item : WishlistItem) : Bool {
            not Text.equal(item.productId, productId);
          }
        );
        wishlist.add(key, updatedItems);
      };
    };
  };
};
