const userConnections = new Map<string, Map<string, string>>();

userConnections.set("u1", new Map());

userConnections.set("u2", new Map());

userConnections.get("u1")!.set("c1", "sk1");

userConnections.get("u1")!.set("c2", "sk2");

userConnections.get("u2")!.set("c3", "sk3");

userConnections.get("u2")!.set("c4", "sk4");

console.log(userConnections);
