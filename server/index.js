const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 商品データ（簡易データベース）
const products = [
  { id: 1, name: 'ノートPC', price: 89800, stock: 5 },
  { id: 2, name: 'マウス', price: 3800, stock: 20 },
  { id: 3, name: 'キーボード', price: 12800, stock: 10 },
];

let cart = [];
let orders = [];

// 商品一覧
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 商品詳細
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: '商品が見つかりません' });
  res.json(product);
});

// カート追加
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: '商品が見つかりません' });
  if (product.stock < quantity) return res.status(400).json({ error: '在庫が不足しています' });
  cart.push({ ...product, quantity });
  res.json({ message: 'カートに追加しました', cart });
});

// カート取得
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// 注文
app.post('/api/orders', (req, res) => {
  if (cart.length === 0) return res.status(400).json({ error: 'カートが空です' });
  const order = { id: orders.length + 1, items: cart, createdAt: new Date() };
  orders.push(order);
  cart = [];
  res.json({ message: '注文が完了しました', order });
});

// ログイン
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'test' && password === 'password') {
    res.json({ success: true, token: 'dummy-token-12345' });
  } else {
    res.status(401).json({ error: 'ユーザー名またはパスワードが違います' });
  }
});

// ログアウト
app.post('/api/logout', (req, res) => {
  res.json({ success: true });
});

// カートリセット（テスト用）
app.delete('/api/cart', (req, res) => {
  cart = [];
  res.json({ message: 'カートをリセットしました' });
});

app.listen(3000, () => console.log('サーバー起動: http://localhost:3000'));