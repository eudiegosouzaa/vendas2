document.addEventListener("DOMContentLoaded", () => {

  const lista = document.getElementById("listaProdutos");
  const btnAdd = document.getElementById("addProduto");
  const form = document.getElementById("formRapido");

  // SUPABASE
  const supabaseUrl = "https://lvsddjwnczedvrlpidzq.supabase.co";
  const supabaseKey = "sb_publishable_5q_jYfpmeLwbUBFhdTvpYA_gN9hOMJ1";

  const client = supabase.createClient(supabaseUrl, supabaseKey);

  // PRODUTOS
  const produtosLista = [
    "Coca-Cola 200ml - R$4,00",
    "Coca-Cola 350ml - R$6,50",
    "Suco 200ml - R$3,00",
    "Trufa - R$6,50",
    "Caixa de doces - R$13,00"
  ];

  // CRIAR LINHA
  function criarLinha() {
    const div = document.createElement("div");
    div.classList.add("linha-produto");

    div.innerHTML = `
      <select required>
        <option value="">Selecione um produto</option>
        ${produtosLista.map(p => `<option>${p}</option>`).join("")}
      </select>

      <input type="number" placeholder="Qtd" min="1" required>

      <button type="button" class="btn-remover">×</button>
    `;

    div.querySelector(".btn-remover").addEventListener("click", () => {
      if (document.querySelectorAll(".linha-produto").length > 1) {
        div.remove();
      } else {
        alert("Precisa ter pelo menos 1 produto!");
      }
    });

    return div;
  }

  // BOTÃO ADD PRODUTO
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      lista.appendChild(criarLinha());
    });
  }

  // PRIMEIRA LINHA
  if (lista) {
    lista.appendChild(criarLinha());
  }

  // TELEFONE SÓ NÚMERO
  const telefoneInput = document.getElementById("telefone");

  if (telefoneInput) {
    telefoneInput.addEventListener("input", () => {
      telefoneInput.value = telefoneInput.value.replace(/\D/g, "");
    });
  }

  // SUBMIT FINALIZAR
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = form.querySelector("#nome")?.value?.trim();
      const telefone = form.querySelector("#telefone")?.value?.trim();

      console.log("DEBUG NOME:", nome);

      if (!nome) {
        alert("Preencha o nome");
        return;
      }

      if (!telefone) {
        alert("Preencha o telefone");
        return;
      }

      const linhas = document.querySelectorAll(".linha-produto");

      for (const linha of linhas) {
        const produto = linha.querySelector("select").value;
        const qtd = linha.querySelector("input").value;

        if (!produto || !qtd) {
          alert("Preencha todos os produtos e quantidades");
          return;
        }

        // 🔥 DATA AJUSTADA PARA BRASIL
        const agoraBrasil = new Date().toLocaleString("sv-SE", {
          timeZone: "America/Sao_Paulo"
        }).replace(" ", "T");

        const { error } = await client
          .from("compras")
          .insert([
            {
              nome: nome,
              telefone: telefone,
              produto: produto,
              qtd: qtd,
              data: agoraBrasil
            }
          ]);

        if (error) {
          console.error(error);
          alert("Erro ao salvar: " + error.message);
          return;
        }
      }

      alert("Compra concluída!");
      window.location.href = "index.html";
    });
  }

});