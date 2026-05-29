import { Router } from "express";
import { prisma } from "../lib/prisma.js"; // Ou a forma como seu prisma está importado no topo

const router = Router();

// ... (Mantenha suas outras rotas de router.get e router.post aqui em cima) ...

// 1. Troque "app.delete('/categories/:id'" por "router.delete('/:id'"
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).send({ error: "Categoria não encontrada" });

    const fixed = ['receita', 'alimentacao', 'transporte', 'moradia', 'lazer'];
    const categoryName = category.name.trim().toLowerCase();

    console.log("Tentando excluir a categoria:", categoryName);
    console.log("Está na lista de fixas?", fixed.includes(categoryName));

    if (fixed.includes(categoryName)) {
      return res.status(400).send({ error: "Essa categoria é protegida pelo sistema!" });
    }

    const count = await prisma.transaction.count({ where: { categoryId: id } });
    if (count > 0) {
      return res.status(400).send({ error: "Categoria possui transações vinculadas" });
    }

    await prisma.category.delete({ where: { id } });
    return res.status(204).send();
    
  } catch (err) {
    console.error("Erro interno no servidor:", err); 
    return res.status(400).send({ 
      error: "Erro ao excluir: " + (err.message || "Erro desconhecido") 
    });
  }
});

export default router;