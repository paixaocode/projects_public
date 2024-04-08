#Include "Protheus.ch"

/*/{Protheus.doc} MT150ENV
Ponto de entrada para permitir ou n�o acessar a atualiza��o do or�amento
@type function
@version 1.0  
@author Gabriel Paix�o
@since 28/03/2024
/*/
User Function MT150ENV()

	Local lRet  := .T.
	Local aArea := FwGetArea()

    /* 
        Caso a falta de estoque tenha sido sinalizada pelo fornecedor no portal
        n�o deixa seguir com a atualiza��o do or�amento.
    */
	If SC8->C8_XSTSPL == 3
		lRet := .F.
        FwAlertInfo(SC8->C8_OBS + " Portanto n�o ser� poss�vel seguir com a atualiza��o do or�amento!", "Atualiza��o indispon�vel!")
	EndIf

	FwRestArea(aArea)

Return lRet
