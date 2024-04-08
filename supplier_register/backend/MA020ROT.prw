#Include "Protheus.ch"

/*/{Protheus.doc} MA020ROT
Ponto de entrada para adicionar botões na barra de ferramentas MATA020.
@Type Function 
@Author Gabriel Paixão
@Since 29/02/2024
/*/
User Function MA020ROT()

	Local aRotUser := {}

	AAdd( aRotUser, { 'Spl. Gerar Token Cad', 'U_AdminTkSpl()', 0, 4 } )

Return (aRotUser)


