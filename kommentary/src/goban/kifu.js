export default class Kifu {
    static parse(text) {
      let at = 0;
      let ch = text.charAt(at);
  
      findOpenParens();
  
      return parseTree();
  
      function error(msg) {
        throw {
          name: "Syntax Error",
          message: msg,
          at: at,
          text: text
        };
      }
  
      function next(check) {
        if (check && check !== ch) {
          error(`Expected '${check}' instead of '${ch}'`);
        }
        at++;
        ch = text.charAt(at);
        return ch;
      }
  
      function white() {
        while (ch && ch <= " ") {
          next();
        }
      }
  
      function findOpenParens() {
        while (ch && ch !== "(") {
          next();
        }
      }
  
      function lineBreak() {
        if (ch === "\n") {
          if (text.charAt(at + 1) === "\r") {
            next();
          }
          return true;
        } else if (ch === "\r") {
          if (text.charAt(at + 1) === "\n") {
            next();
          }
          return true;
        }
        return false;
      }
  
      function parseTree() {
        let rootNode;
        let currentNode;
        let nextNode;
  
        next("(");
        white();
  
        if (ch !== ";") {
          error("Sub-tree missing root");
        }
        rootNode = parseNode();
        white();
  
        currentNode = rootNode;
        while (ch === ";") {
          nextNode = parseNode();
          currentNode.children.push(nextNode);
          currentNode = nextNode;
          white();
        }
  
        while (ch === "(") {
          nextNode = parseTree();
          currentNode.children.push(nextNode);
          white();
        }
        next(")");
  
        return rootNode;
      }
  
      function parseNode() {
        let property;
        let node = { props: [], children: [] };
  
        next(";");
        white();
        while (ch && ch !== ";" && ch !== "(" && ch !== ")") {
          property = parseProperty();
          node.props.push(property);
          white();
        }
  
        return node;
      }
  
      function parseProperty() {
        let property = { id: "", values: [] };
  
        while (ch && /[A-Za-z]/.test(ch)) {
          if (/[A-Z]/.test(ch)) {
            property.id += ch;
          }
          next();
        }
        if (!property.id) {
          error("Missing property ID");
        }
  
        white();
        while (ch === "[") {
          property.values.push(parseValue());
          white();
        }
        if (property.values.length === 0) {
          error("Missing property values");
        }
  
        return property;
      }
  
      function parseValue() {
        let value = "";
        next("[");
  
        while (ch && ch !== "]") {
          if (ch === "\\") {
            next("\\");
            if (lineBreak()) {
            } else if (ch <= " ") {
              value += " ";
            } else {
              value += ch;
            }
          } else {
            if (lineBreak()) {
              value += "\n";
            } else if (ch <= " ") {
              value += " ";
            } else {
              value += ch;
            }
          }
          next();
        }
        next("]");
  
        return value;
      }
    }
  }
  