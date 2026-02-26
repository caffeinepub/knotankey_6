import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
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
    id : Text;
    orderId : Text;
    email : Text;
    reason : Text;
    description : Text;
    createdAt : Time.Time;
  };

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let customOrderRequests = Map.empty<Text, CustomOrderRequest>();
  let returnRequests = Map.empty<Text, ReturnRequest>();
  let newsletterSubscribers = List.empty<Text>();

  let adminPasscode = "knotankey_admin_2026";

  // Products
  public shared ({ caller }) func createProduct(passcode : Text, product : Product) : async () {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(passcode : Text, product : Product) : async () {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(passcode : Text, productId : Text) : async () {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    products.remove(productId);
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

  // Orders
  public shared ({ caller }) func createOrder(order : Order) : async Text {
    orders.add(order.id, order);
    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(passcode : Text, orderId : Text, status : Text) : async () {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func getOrders(passcode : Text) : async [Order] {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
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
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    customOrderRequests.values().toArray();
  };

  // Returns
  public shared ({ caller }) func createReturnRequest(request : ReturnRequest) : async () {
    returnRequests.add(request.id, request);
  };

  public shared ({ caller }) func getReturnRequests(passcode : Text) : async [ReturnRequest] {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    returnRequests.values().toArray();
  };

  // Newsletter
  public shared ({ caller }) func subscribeToNewsletter(email : Text) : async () {
    let alreadyExists = newsletterSubscribers.filter(func(existingEmail) { existingEmail == email }).isEmpty();
    if (alreadyExists) {
      newsletterSubscribers.add(email);
    };
  };

  public shared ({ caller }) func getSubscribers(passcode : Text) : async [Text] {
    if (passcode != adminPasscode) {
      Runtime.trap("Unauthorized");
    };
    newsletterSubscribers.toArray();
  };
};
