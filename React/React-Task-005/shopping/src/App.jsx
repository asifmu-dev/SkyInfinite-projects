import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Fountain Pen", price: 28.0, note: "Fine nib, refillable" },
  { id: 2, name: "Dot Grid Notebook", price: 14.5, note: "160 pages, lay-flat" },
  { id: 3, name: "Desk Lamp", price: 46.0, note: "Warm, dimmable LED" },
  { id: 4, name: "Ceramic Mug", price: 18.0, note: "350 ml, dishwasher safe" },
  { id: 5, name: "Highlighter Set", price: 9.75, note: "Pack of 6 pastels" },
  { id: 6, name: "Wool Desk Mat", price: 39.0, note: "80 x 40 cm, felt" },
  { id: 7, name: "Brass Bookends", price: 32.0, note: "Pair, non-slip base" },
];

const money = (n) => `$${n.toFixed(2)}`;

function ProductCard({ product, inCart, onAddToCart }) {
  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p className="muted">{product.note}</p>
      <div className="card-foot">
        <strong>{money(product.price)}</strong>
        <button className="btn" onClick={() => onAddToCart(product.id)}>
          {inCart > 0 ? `Add another (${inCart} in cart)` : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
function CartItem({ item, onChangeQty, onRemove }) {
  return (
    <li className="cart-row">
      <div className="cart-info">
        <span>{item.name}</span>
        <span className="muted">{money(item.price)} each</span>
      </div>
      <div className="qty">
        <button
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onChangeQty(item.id, item.qty - 1)}
        >
          −
        </button>
        <span aria-live="polite">{item.qty}</span>
        <button
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => onChangeQty(item.id, item.qty + 1)}
        >
          +
        </button>
      </div>
      <strong className="line-total">{money(item.price * item.qty)}</strong>
      <button className="remove" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </li>
  );
}

function Cart({ items, onChangeQty, onRemove, onClear }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <aside className="cart" aria-label="Shopping cart">
      <h2>Your cart {count > 0 && <span className="badge">{count}</span>}</h2>

      {items.length === 0 ? (
        <p className="muted empty">Nothing here yet. Add a product from the catalog.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onChangeQty={onChangeQty}
                onRemove={onRemove}
              />
            ))}
          </ul>
          <div className="total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <button className="btn ghost" onClick={onClear}>
            Empty cart
          </button>
        </>
      )}
    </aside>
  );
}

export default function App() {
  const [cart, setCart] = useState([]); 

  const addToCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      return existing
        ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { id, qty: 1 }];
    });
  };

  const changeQty = (id, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l))
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((l) => l.id !== id));
  const clearCart = () => setCart([]);

  const cartItems = cart.map((line) => ({
    ...PRODUCTS.find((p) => p.id === line.id),
    qty: line.qty,
  }));

  const qtyInCart = (id) => cart.find((l) => l.id === id)?.qty ?? 0;

  return (
    <div className="app">
      <style>{css}</style>

      <header className="top">
        <h1>Deskside</h1>
        <p className="muted">Small things for a good desk.</p>
      </header>

      <main className="layout">
        <section className="grid" aria-label="Products">
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inCart={qtyInCart(p.id)}
              onAddToCart={addToCart}
            />
          ))}
        </section>

        <Cart
          items={cartItems}
          onChangeQty={changeQty}
          onRemove={removeItem}
          onClear={clearCart}
        />
      </main>
    </div>
  );
}
const css = `
:root {
  --bg: #eef1f4; --surface: #ffffff; --ink: #14213d; --muted: #5b6577;
  --line: #d5dae2; --hi: #ffd60a;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink);
  font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif; line-height: 1.45; }
.app { max-width: 1100px; margin: 0 auto; padding: 32px 20px 56px; }
.top h1 { margin: 0; font-size: 2.4rem; letter-spacing: -0.02em;
  background: linear-gradient(transparent 62%, var(--hi) 62%); display: inline-block; }
.top p { margin: 6px 0 24px; }
.muted { color: var(--muted); font-size: 0.9rem; margin: 0; }
.layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 10px;
  padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.card h3 { margin: 0; font-size: 1.05rem; }
.card-foot { margin-top: auto; padding-top: 10px; display: flex; flex-direction: column; gap: 8px; }
.btn { background: var(--ink); color: #fff; border: 2px solid var(--ink); border-radius: 6px;
  padding: 8px 10px; font: inherit; font-size: 0.9rem; cursor: pointer; }
.btn:hover { background: #22335c; }
.btn.ghost { background: transparent; color: var(--ink); width: 100%; margin-top: 12px; }
.btn.ghost:hover { background: var(--bg); }
button:focus-visible { outline: 3px solid var(--hi); outline-offset: 2px; }
.cart { position: sticky; top: 16px; background: var(--surface); border: 1px solid var(--line);
  border-radius: 10px; padding: 18px; }
.cart h2 { margin: 0 0 12px; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; }
.badge { background: var(--hi); border-radius: 99px; font-size: 0.8rem; padding: 1px 9px; }
.empty { padding: 12px 0; }
.cart-list { list-style: none; margin: 0; padding: 0; }
.cart-row { display: grid; grid-template-columns: 1fr auto; gap: 4px 10px;
  padding: 12px 0; border-top: 1px solid var(--line); align-items: center; }
.cart-info { display: flex; flex-direction: column; }
.line-total { grid-column: 2; grid-row: 1; justify-self: end; }
.qty { grid-column: 1; display: inline-flex; align-items: center; gap: 10px; }
.qty button { width: 28px; height: 28px; border: 1px solid var(--line); background: var(--bg);
  border-radius: 6px; font-size: 1rem; cursor: pointer; }
.qty button:hover { border-color: var(--ink); }
.remove { grid-column: 2; justify-self: end; background: none; border: none;
  color: #b3261e; font: inherit; font-size: 0.85rem; cursor: pointer; text-decoration: underline; }
.total { display: flex; justify-content: space-between; border-top: 2px solid var(--ink);
  padding-top: 12px; font-size: 1.15rem; }
@media (max-width: 800px) {
  .layout { grid-template-columns: 1fr; }
  .cart { position: static; }
}
`;