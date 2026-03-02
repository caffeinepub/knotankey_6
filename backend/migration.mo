import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  type OldReturnRequest = {
    id : Text;
    orderId : Text;
    email : Text;
    reason : Text;
    description : Text;
    createdAt : Time.Time;
  };

  type OldActor = {
    products : Map.Map<Text, {
      id : Text;
      title : Text;
      description : Text;
      price : Nat;
      image : Storage.ExternalBlob;
      category : Text;
      bestseller : Bool;
      createdAt : Time.Time;
    }>;
    orders : Map.Map<Text, {
      id : Text;
      customerInfo : {
        fullName : Text;
        email : Text;
        phone : Text;
        address : Text;
        city : Text;
        postalCode : Text;
        country : Text;
      };
      items : [{
        productId : Text;
        title : Text;
        quantity : Nat;
        price : Nat;
      }];
      subtotal : Nat;
      shippingAmount : Nat;
      total : Nat;
      status : Text;
      createdAt : Time.Time;
    }>;
    customOrderRequests : Map.Map<Text, {
      id : Text;
      productType : Text;
      colorPreference : Text;
      size : Text;
      description : Text;
      inspirationImage : Storage.ExternalBlob;
      budgetRange : Text;
      email : Text;
      createdAt : Time.Time;
    }>;
    returnRequests : Map.Map<Text, OldReturnRequest>;
    wishlist : Map.Map<Text, List.List<{
      email : Text;
      productId : Text;
      addedAt : Time.Time;
    }>>;
    categories : Set.Set<Text>;
  };

  type NewReturnRequest = {
    orderNumber : Text;
    customerName : Text;
    email : Text;
    reason : Text;
    message : Text;
    video : Storage.ExternalBlob;
    createdAt : Time.Time;
  };

  type NewActor = {
    products : Map.Map<Text, {
      id : Text;
      title : Text;
      description : Text;
      price : Nat;
      image : Storage.ExternalBlob;
      category : Text;
      bestseller : Bool;
      createdAt : Time.Time;
    }>;
    orders : Map.Map<Text, {
      id : Text;
      customerInfo : {
        fullName : Text;
        email : Text;
        phone : Text;
        address : Text;
        city : Text;
        postalCode : Text;
        country : Text;
      };
      items : [{
        productId : Text;
        title : Text;
        quantity : Nat;
        price : Nat;
      }];
      subtotal : Nat;
      shippingAmount : Nat;
      total : Nat;
      status : Text;
      createdAt : Time.Time;
    }>;
    customOrderRequests : Map.Map<Text, {
      id : Text;
      productType : Text;
      colorPreference : Text;
      size : Text;
      description : Text;
      inspirationImage : Storage.ExternalBlob;
      budgetRange : Text;
      email : Text;
      createdAt : Time.Time;
    }>;
    returnRequests : Map.Map<Text, NewReturnRequest>;
    wishlist : Map.Map<Text, List.List<{
      email : Text;
      productId : Text;
      addedAt : Time.Time;
    }>>;
    categories : Set.Set<Text>;
  };

  public func run(old : OldActor) : NewActor {
    let newReturnRequests = old.returnRequests.map<Text, OldReturnRequest, NewReturnRequest>(
      func(_id, oldRequest) {
        {
          orderNumber = oldRequest.id;
          customerName = "";
          email = oldRequest.email;
          reason = oldRequest.reason;
          message = oldRequest.description;
          video = ""; // Fix: Assign empty Text value for video field
          createdAt = oldRequest.createdAt;
        };
      }
    );
    {
      old with
      returnRequests = newReturnRequests
    };
  };
};
