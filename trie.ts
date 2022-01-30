class TrieNode {
  children: {
    [key: string]: TrieNode;
  };
  endOfWord: boolean;
  level: number;

  constructor() {
    this.children = {};
    this.endOfWord = false;
    this.level = -1;
  }
}

class Trie {
  public root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  public insert(word: string) {
    let cur = this.root;
    let index = 1;
    for (const c of word) {
      if (cur.children[c] === undefined) {
        cur.children[c] = new TrieNode();
      }
      cur.level = index;
      cur = cur.children[c];
      index = index + 1;
    }
    cur.level = word.length;
    cur.endOfWord = true;
  }

  public nodePrint(trieNode: TrieNode) {
    if (Object.keys(trieNode.children).length === 0) return;
    console.log("TrieNode: ", trieNode.children);
  }

  public print(trieNode: TrieNode) {
    this.nodePrint(trieNode);
    const children = trieNode.children;
    const keys = Object.keys(children);
    for (const key of keys) {
      this.print(children[key]);
    }
  }

  public search(word: string): TrieNode[] | null {
    let result: TrieNode[] = [];
    let cur = this.root;
    for (const c of word) {
      if (cur.children[c] == undefined) {
        return null;
      }
      cur = cur.children[c];
      result.push(cur);
    }
    if (result[result.length - 1].endOfWord === false) return null;
    return result;
  }
}

function main() {
  console.log("Trie Data Structure Practice");
  let trie = new Trie();

  trie.insert("trie");
  trie.insert("tree");
  trie.insert("tremendous");
  const result = trie.search("tree");
  console.log(result);
}

main();
