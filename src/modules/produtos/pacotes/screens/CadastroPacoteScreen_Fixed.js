// Select de produtos com filtro integrado - substitua o trecho do select no arquivo original

<Grid item xs={12} md={5}>
  {novoItem.tipo === "produto" ? (
    <Box>
      <TextField
        fullWidth
        label="Produto"
        name="itemId"
        value={novoItem.itemId}
        onChange={handleNovoItemChange}
        size="small"
        disabled={carregandoProdutos}
        select
      >
        <MenuItem value="">Selecione</MenuItem>
        {produtosFiltrados.map(
          (produto) => (
            <MenuItem key={produto.id} value={produto.id}>
              {produto.nome} - R$ {produto.preco.toFixed(2)}
            </MenuItem>
          ),
        )}
      </TextField>
      <TextField
        fullWidth
        placeholder="Filtrar produtos..."
        value={termoBuscaProdutos}
        onChange={(e) => setTermoBuscaProdutos(e.target.value)}
        size="small"
        disabled={carregandoProdutos}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 1 }}
      />
    </Box>
  ) : (
    <TextField
      fullWidth
      label="Serviço"
      value={termoBuscaServicos}
      onChange={(e) => setTermoBuscaServicos(e.target.value)}
      size="small"
      placeholder="Descreva o serviço..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )}
</Grid>
