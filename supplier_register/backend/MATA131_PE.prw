#Include "Protheus.ch"
#Include "FwMVCDef.ch"

/*/{Protheus.doc} MATA131
Ponto de entrada MVC, rotina de cotação.
@Type Function
@Author Gabriel Paixão
@Since 18/03/2024
/*/
User Function MATA131()

	Local xRet  	  := .T.
	Local aArea		  := FwGetArea()
	Local aRows		  := {}
	Local oModel 	  := Nil
	Local oMdlSC8	  := Nil
	Local oMdlSC1	  := Nil
	Local cIdModel	  := ""
	Local cForm 	  := ""
	Local nX,nI		  := 0
	Local aForSpl	  := {}
	Local aProds	  := {}
	Local lCadWeb     := .F.
	Local lForAtivo   := .F.
	Local cCodFor 	  := ""
	Local cDocument   := ""
	Local cToken 	  := ""
	Local cNumOrc	  := ""	
	Local cNecessi    := ""
	Local cStatusProd := ""

	If ParamIXB != Nil

		oModel   := ParamIXB[1]
		cForm    := ParamIXB[2]
		cIdModel := ParamIXB[3]

		If cForm == "MODELCOMMITTTS"
			oMdlSC8 := oModel:GetModel("SC8DETAIL")
			oMdlSC1 := oModel:GetModel("SC1DETAIL")
			xRet 	:= oMdlSC8 != Nil .And. oMdlSC1 != Nil

			If xRet
				//Valida os fornecedores que utilizam o Supplier Portal
				aRows := FwSaveRows()
				For nX := 1 to oMdlSC8:Length()
					oMdlSC8:GoLine(nX)
					If !oMdlSC8:IsDeleted()
						lCadWeb    := ReadValue('SA2',1,FwxFilial("SA2") + oMdlSC8:GetValue("C8_FORNECE") , "A2_CADSUP") == "1"
						lForAtivo  := ReadValue('SA2',1,FwxFilial("SA2") + oMdlSC8:GetValue("C8_FORNECE") , "A2_MSBLQL") == "2"
						If lCadWeb .And. lForAtivo

							cCodFor   := ReadValue('SA2',1,FwxFilial("SA2") + oMdlSC8:GetValue("C8_FORNECE") , "A2_COD")
							cDocument := ReadValue('SA2',1,FwxFilial("SA2") + oMdlSC8:GetValue("C8_FORNECE") , "A2_CGC")
							cToken    := WebEncript(ReadValue('SA2',1,FwxFilial("SA2") + oMdlSC8:GetValue("C8_FORNECE") , "A2_TOKEN"), .T.)
							cNumOrc	  := oMdlSC8:GetValue("C8_NUM")
							cNecessi  := DtoC(oMdlSC8:GetValue("C8_DATPRF"))

							For nI := 1 to oMdlSC1:Length()
								oMdlSC1:GoLine(nI)
								If !oMdlSC1:IsDeleted()
									cStatusProd := U_GetStProd(oMdlSC8:GetValue("C8_XSTSPL"))
									aAdd(aProds, {AllTrim(oMdlSC1:GetValue("C1_PRODUTO")), AllTrim(oMdlSC1:GetValue("C1_DESCRI")), oMdlSC1:GetValue("C1_QUANT"), oMdlSC8:GetValue("C8_UM"), cNecessi, oMdlSC8:GetValue("C8_ITEM"), oMdlSC8:GetValue("C8_NUMPRO"), cStatusProd })
								EndIf
							Next

							aAdd(aForSpl, {cCodFor, cDocument, cToken, cNumOrc, aProds})
						EndIf
					EndIf
				Next

				If xRet
					//Armazena a cotação na tabela ZLX
					xRet := u_StorageBud(aForSpl, "SPL001", .T.)
					If xRet
						FwAlertInfo("A cotação foi enviada para os fornecedores que usam o Supplier Portal.", "Aviso!")
					Else
						FwAlertWarning("Não foi possível acionar os fornecedores que usam o Supplier Portal.", "Aviso!")
					EndIf
				EndIf
			EndIf
		EndIf
	EndIf


	FwRestArea(aArea)
	FWRestRows(aRows)

Return xRet
