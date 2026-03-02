import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

module {
  type OldProduct = {
    id : Text;
    title : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
    category : Text;
    bestseller : Bool;
    createdAt : Time.Time;
  };

  type OldOrderItem = {
    productId : Text;
    title : Text;
    quantity : Nat;
    price : Nat;
  };

  type OldOrder = {
    id : Text;
    customerInfo : OldCustomerInfo;
    items : [OldOrderItem];
    subtotal : Nat;
    shippingAmount : Nat;
    total : Nat;
    status : Text;
    createdAt : Time.Time;
  };

  type OldCustomerInfo = {
    fullName : Text;
    email : Text;
    phone : Text;
    address : Text;
    city : Text;
    postalCode : Text;
    country : Text;
  };

  type NewOrder = {
    id : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    shippingAddress : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
    items : [OldOrderItem];
    totalPrice : Nat;
    orderDate : Time.Time;
    orderStatus : Text;
  };

  type ReturnRequest = {
    orderNumber : Text;
    customerName : Text;
    email : Text;
    reason : Text;
    message : Text;
    video : Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  type WishlistItem = {
    email : Text;
    productId : Text;
    addedAt : Time.Time;
  };

  type OldActor = {
    products : Map.Map<Text, OldProduct>;
    orders : Map.Map<Text, OldOrder>;
    returnRequests : Map.Map<Text, ReturnRequest>;
    wishlist : Map.Map<Text, List.List<WishlistItem>>;
    categories : Set.Set<Text>;
    adminPasscode : Text;
    customOrderRequests : Map.Map<Text, OldCustomOrderRequest>;
  };

  type OldCustomOrderRequest = {
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

  type NewActor = {
    products : Map.Map<Text, OldProduct>;
    orders : Map.Map<Text, NewOrder>;
    returnRequests : Map.Map<Text, ReturnRequest>;
    wishlist : Map.Map<Text, List.List<WishlistItem>>;
    categories : Set.Set<Text>;
    customOrderRequests : Map.Map<Text, OldCustomOrderRequest>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        {
          id = oldOrder.id;
          customerName = oldOrder.customerInfo.fullName;
          email = oldOrder.customerInfo.email;
          phone = oldOrder.customerInfo.phone;
          shippingAddress = oldOrder.customerInfo.address;
          city = oldOrder.customerInfo.city;
          state = "";
          postalCode = oldOrder.customerInfo.postalCode;
          country = oldOrder.customerInfo.country;
          items = oldOrder.items;
          totalPrice = oldOrder.total;
          orderDate = oldOrder.createdAt;
          orderStatus = oldOrder.status;
        };
      }
    );
    {
      old with
      orders = newOrders;
    };
  };
};
