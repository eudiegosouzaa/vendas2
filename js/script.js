import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// 🔹 Supabase
const supabase = createClient(
  "https://lvsddjwnczedvrlpidzq.supabase.co",
  "sb_publishable_5q_jYfpmeLwbUBFhdTvpYA_gN9hOMJ1"
);

// ELEMENTOS
const formularioContainer = document.querySelector('.Formulario');
const btnLogin = document.getElementById('btnLogin');
const btnRegistro = document.getElementById('btnRegistro');
const btnRapido = document.querySelector(".btn-rapido");

// =========================
// 🔄 TROCA DE TELAS
// =========================
btnLogin.addEventListener('click', () => {
  formularioContainer.classList.remove('ativo');
  btnLogin.classList.add('ativo');
  btnRegistro.classList.remove('ativo');
});

btnRegistro.addEventListener('click', () => {
  formularioContainer.classList.add('ativo');
  btnRegistro.classList.add('ativo');
  btnLogin.classList.remove('ativo');
});

// 👉 REGISTRO RÁPIDO
btnRapido.addEventListener("click", () => {
  window.location.href = "registro-rapido.html";
});

// =========================
// 📱 VALIDAÇÃO TELEFONE
// =========================
function telefoneValido(telefone) {
  const numero = telefone.replace(/\D/g, "");
  return numero.length === 11;
}

// =========================
// ===== REGISTRO =====
// =========================
const formularioRegistro = document.querySelector(".form-registro");

formularioRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = formularioRegistro.querySelector('input[placeholder="Usuário"]').value;
  let telefone = formularioRegistro.querySelector('input[placeholder="Telefone"]').value;
  const senha = formularioRegistro.querySelector('input[placeholder="Senha"]').value;

  // 🔥 limpa telefone
  telefone = telefone.replace(/\D/g, "");

  // ❌ valida telefone
  if (!telefoneValido(telefone)) {
    alert("Telefone inválido! Use DDD + número (ex: 11999999999)");
    return;
  }

  try {
    const { error } = await supabase
      .from("usuarios")
      .insert([{ usuario, telefone, senha }]);

    if (error) {
      // 🔥 erro de duplicidade
      if (error.message.includes("telefone_unico")) {
        alert("Esse telefone já está cadastrado!");
      } else {
        alert("Erro ao registrar: " + error.message);
      }
      return;
    }

    alert("Usuário registrado com sucesso!");

    // limpa campos
    formularioRegistro.reset();

    // volta pro login
    formularioContainer.classList.remove('ativo');
    btnLogin.classList.add('ativo');
    btnRegistro.classList.remove('ativo');

  } catch (err) {
    console.error(err);
    alert("Erro inesperado: " + err.message);
  }
});

// =========================
// ===== LOGIN =====
// =========================
const formularioLogin = document.querySelector(".form-login");

formularioLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  let usuarioInput = formularioLogin.querySelector('input[placeholder="Usuário ou Telefone"]').value;
  const senhaInput = formularioLogin.querySelector('input[placeholder="Senha"]').value;

  // 🔥 limpa telefone se for número
  const numeroLimpo = usuarioInput.replace(/\D/g, "");

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .or(`usuario.eq.${usuarioInput},telefone.eq.${numeroLimpo}`)
      .eq("senha", senhaInput)
      .limit(1)
      .single();

    if (error || !data) {
      alert("Usuário ou senha incorretos!");
      return;
    }

    alert(`Bem-vindo, ${data.usuario}!`);

    // 👉 redireciona
    window.location.href = "dados.html";

  } catch (err) {
    console.error(err);
    alert("Erro no login: " + err.message);
  }
});