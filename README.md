# Amigo Invisible Express

Single-page app para organizar tu amigo invisible sin spoilers. Permite añadir nombres, generar el sorteo evitando autoasignaciones y cruces dobles, y revelar el destinatario de cada persona uno a uno.

## Caracteristicas
- Sorteo justo: nadie se asigna a si mismo ni hay pares recíprocos.
- Flujo de revelado paso a paso: cada participante ve solo a quien regala.
- Modo oscuro (por defecto) y modo claro con toggle.
- UI responsive con pills para participantes y tarjeta de resultado.

## Requisitos
- Node 18+ (se recomienda 18 LTS o superior).

## Instalacion y uso
```bash
npm install
npm run dev
```
Abre la URL que muestre Vite (por defecto http://localhost:5173).

## Como funciona el sorteo
- Introduce al menos 3 nombres.
- Pulsa "Generar reparto" para crear las parejas.
- Para cada turno, pulsa "Mostrar" para ver a quien regalas y luego "Siguiente".
- "Reiniciar reparto" reinicia solo la revelacion; "Limpiar lista" borra todos los nombres.

## Personalizacion rapida
- Colores y temas: ajusta variables en `src/index.css`.
- Textos y copys: edita `src/App.jsx`.
