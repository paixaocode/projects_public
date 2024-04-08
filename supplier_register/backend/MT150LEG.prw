#Include "Protheus.ch"

/*/{Protheus.doc} MT150LEG
Ponto de entrada para adicionar legendas na rotina de atualização de cotação
@type function
@version 1.0  
@author Gabriel Paixão
@since 28/03/2024
/*/
User Function MT150LEG()

	Local nNum := PARAMIXB[1]
	Local aRet := {}

	If nNum == 1
		aAdd(aRet,{ 'C8_XSTSPL == 3' , 'BR_PRETO' })
	ElseIf nNum == 2
		aAdd(aRet,{'BR_PRETO' , 'Fornecedor sem estoque' })
	EndIf
    
Return aRet
