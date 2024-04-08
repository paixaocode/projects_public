#Include "Protheus.ch"

/*/{Protheus.doc} MT150ENV
Ponto de entrada para permitir ou não acessar a atualização do orçamento
@type function
@version 1.0  
@author Gabriel Paixão
@since 28/03/2024
/*/
User Function MT150ENV()

	Local lRet  := .T.
	Local aArea := FwGetArea()

    /* 
        Caso a falta de estoque tenha sido sinalizada pelo fornecedor no portal
        não deixa seguir com a atualização do orçamento.
    */
	If SC8->C8_XSTSPL == 3
		lRet := .F.
        FwAlertInfo(SC8->C8_OBS + " Portanto não será possível seguir com a atualização do orçamento!", "Atualização indisponível!")
	EndIf

	FwRestArea(aArea)

Return lRet
