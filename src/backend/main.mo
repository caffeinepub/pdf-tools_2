import Order "mo:core/Order";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Tool usage statistics
  let toolUsage = Map.empty<Text, Nat>();

  // Processing history entry
  type HistoryEntry = {
    toolName : Text;
    originalFile : Text;
    resultFile : Text;
    timestamp : Time.Time;
  };

  module HistoryEntry {
    public func compare(e1 : HistoryEntry, e2 : HistoryEntry) : Order.Order {
      switch (Text.compare(e1.toolName, e2.toolName)) {
        case (#equal) { Int.compare(e1.timestamp, e2.timestamp) };
        case (order) { order };
      };
    };
  };

  // Map from principal to history entries array
  let userHistory = Map.empty<Principal, [HistoryEntry]>();

  // Tool stats functions
  public shared ({ caller }) func incrementToolUsage(toolName : Text) : async Nat {
    let count = switch (toolUsage.get(toolName)) {
      case (null) { 0 };
      case (?existing) { existing };
    };
    toolUsage.add(toolName, count + 1);
    count + 1;
  };

  public query ({ caller }) func getToolUsage() : async [(Text, Nat)] {
    toolUsage.toArray();
  };

  // File reference functions
  public shared ({ caller }) func addFileReference(_blob : Storage.ExternalBlob) : async () {
    // Blobs are managed by blob-storage. No additional tracking in backend required.
  };

  // History functions
  public shared ({ caller }) func addHistoryEntry(toolName : Text, originalFile : Text, resultFile : Text) : async () {
    let newEntry : HistoryEntry = {
      toolName;
      originalFile;
      resultFile;
      timestamp = Time.now();
    };

    let currentHistory = switch (userHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };

    userHistory.add(caller, [newEntry].concat(currentHistory));
  };

  public query ({ caller }) func getHistory() : async [HistoryEntry] {
    switch (userHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history.sort() };
    };
  };

  public query ({ caller }) func getAllUserHistories() : async [(Principal, [HistoryEntry])] {
    let filtered = userHistory.entries().toArray();
    filtered;
  };

  // Task coordination (simplified and not persistent)
  public shared ({ caller }) func submitTask(_tool : Text, _input : Text) : async Nat {
    1;
  };

  public shared ({ caller }) func updateTaskStatus(_taskId : Nat, _output : Text) : async () {
    // Task status updated
  };
};
