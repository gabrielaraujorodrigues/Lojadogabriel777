import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then(res => res.json())
      .then(setProdutos);
  }, []);

  const add = (p) => setCarrinho([...carrinho, p]);

  const pagar = async () => {
    const total = carrinho.reduce((s,i)=>s+i.preco,0);

    const res = await fetch("http://localhost:3000/pagar", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ total })
    });

    const data = await res.json();

    const mp = new window.MercadoPago("SUA_PUBLIC_KEY");

    mp.checkout({
      preference: { id: data.id },
      autoOpen: true
    });
  };

  return (
    <div style={{padding:20}}>
      <h1>Loja do Gabriel</h1>

      {produtos.map(p => (
        <div key={p._id}>
          <img src={p.img} width={120}/>
          <h2>{p.nome}</h2>
          <p>R$ {p.preco}</p>
          <button onClick={()=>add(p)}>Adicionar</button>
        </div>
      ))}

      <h2>Total: R$ {carrinho.reduce((s,i)=>s+i.preco,0)}</h2>
      <button onClick={pagar}>Pagar</button>
    </div>
  );
}