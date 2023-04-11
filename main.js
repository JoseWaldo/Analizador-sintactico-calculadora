function parse(tokens) {
  let current = 0;

  function parseExpression() {
    let left = parseTerm();

    while (
      current < tokens.length &&
      (tokens[current].type === "plus" || tokens[current].type === "minus")
    ) {
      let operator = tokens[current];
      current++;
      let right = parseTerm();
      left = { type: operator.type, left, right };
    }

    return left;
  }

  function parseTerm() {
    let left = parseFactor();

    while (
      current < tokens.length &&
      (tokens[current].type === "multiply" || tokens[current].type === "divide")
    ) {
      let operator = tokens[current];
      current++;
      let right = parseFactor();
      left = { type: operator.type, left, right };
    }

    return left;
  }

  function parseFactor() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;
      return { type: "number", value: token.value };
    }

    if (token.type === "left_paren") {
      current++;
      let expression = parseExpression();
      if (tokens[current].type !== "right_paren") {
        throw new Error("Falta un paréntesis derecho");
      }
      current++;
      return expression;
    }

    throw new Error(`Token inválido: ${token.type}`);
  }

  return parseExpression();
}

function tokenize(expression) {
  const tokens = [];

  let i = 0;
  while (i < expression.length) {
    let char = expression[i];

    // Si el caracter es un número, crea un token para el número.
    if (/[0-9]/.test(char)) {
      let value = "";
      while (i < expression.length && /[0-9]/.test(expression[i])) {
        value += expression[i];
        i++;
      }
      tokens.push({ type: "number", value });
    }

    // Si el caracter es un signo de suma, crea un token para la suma.
    else if (char === "+") {
      tokens.push({ type: "plus", value: "+" });
      i++;
    }

    // Si el caracter es un signo de resta, crea un token para la resta.
    else if (char === "-") {
      tokens.push({ type: "minus", value: "-" });
      i++;
    }

    // Si el caracter es un signo de multiplicación, crea un token para la multiplicación.
    else if (char === "*") {
      tokens.push({ type: "multiply", value: "*" });
      i++;
    }

    // Si el caracter es un signo de división, crea un token para la división.
    else if (char === "/") {
      tokens.push({ type: "divide", value: "/" });
      i++;
    }

    // Si el caracter es un paréntesis izquierdo, crea un token para el paréntesis izquierdo.
    else if (char === "(") {
      tokens.push({ type: "left_paren", value: "(" });
      i++;
    }

    // Si el caracter es un paréntesis derecho, crea un token para el paréntesis derecho.
    else if (char === ")") {
      tokens.push({ type: "right_paren", value: ")" });
      i++;
    }

    // Si el caracter es un espacio en blanco, ignóralo.
    else if (char === " ") {
      i++;
    }

    // Si el caracter no es válido, lanza un error.
    else {
      throw new Error(`Token inválido: ${char}`);
    }
  }

  return tokens;
}

function handleSubmit(event) {
  event.preventDefault();
  const expressionInput = document.getElementById("expression");
  const expression = expressionInput.value;
  const messageOutput = document.getElementById("message");

  try {
    const tokens = tokenize(expression);
    const result = parse(tokens);
    console.log(result);
    messageOutput.textContent = "La expresión matemática es válida";
    messageOutput.style.color = "green";
  } catch (error) {
    const msg = `La expresión matemática es inválida.\n${error.message}`;
    messageOutput.textContent = msg;
    messageOutput.style.color = "red";
  }

  setTimeout(() => {
    messageOutput.textContent = "";
  }, 5000);
}
