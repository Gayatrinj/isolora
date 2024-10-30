// // src/app/components/ItemList.tsx
// "use client";

// import { useEffect, useState } from "react";

// export default function ItemList() {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     async function fetchItems() {
//       const res = await fetch("/api/item/list");
//       const data = await res.json();
//       setItems(data.items);
//     }

//     fetchItems();
//   }, []);

//   return (
//     <div className="item-list">
//       {items.map((item) => (
//         <div key={item.itemid} className="item-card">
//           <h3>{item.name}</h3>
//           <p>{item.category}</p>
//           <p>{item.description}</p>
//           <p>Price: ${item.price}</p>
//           <p>Quantity: {item.quantity}</p>
//           {item.image_url && <img src={item.image_url} alt={item.name} />}
//         </div>
//       ))}
//     </div>
//   );
// }
