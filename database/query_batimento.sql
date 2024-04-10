select 
	p.id as id_pedido,
	c.nome as nome_cliente,
	c.cpf,
	p2.nome as nome_produto,
	p2.preco as preco_produto,
	pp.quantidade as quantidade_produto_pedido,
	p.valor_total 
from fast_food.cliente c
inner join fast_food.pedido p on p.cliente_id = c.id
inner join fast_food.produto_pedido pp on pp.pedido_id = p.id
inner join fast_food.produto p2 on p2.id = pp.produto_id;
