Feature: Cálculo de IMC
  Como usuario del sistema
  Quiero calcular mi Índice de Masa Corporal (IMC)
  Para conocer mi categoría de peso

  # Normal
  Scenario: Calcular IMC con altura 1.75m y peso 70kg
    Given que ingreso una altura de 1.75 metros y un peso de 70 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 22.86
    And la categoría debería ser "Normal"

  Scenario: Calcular IMC con altura 1.88m y peso 85kg
    Given que ingreso una altura de 1.88 metros y un peso de 85 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 24.05
    And la categoría debería ser "Normal"

  Scenario: Calcular IMC con altura 1.80m y peso 75kg
    Given que ingreso una altura de 1.80 metros y un peso de 75 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 23.15
    And la categoría debería ser "Normal"

  # Bajo peso
  Scenario: Calcular IMC con altura 1.75m y peso 50kg
    Given que ingreso una altura de 1.75 metros y un peso de 50 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 16.33
    And la categoría debería ser "Bajo peso"

  Scenario: Calcular IMC con altura 1.80m y peso 40kg
    Given que ingreso una altura de 1.80 metros y un peso de 40 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 12.35
    And la categoría debería ser "Bajo peso"

  Scenario: Calcular IMC con altura 1.76m y peso 56kg
    Given que ingreso una altura de 1.76 metros y un peso de 56 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 18.08
    And la categoría debería ser "Bajo peso"

  # Sobrepeso
  Scenario: Calcular IMC con altura 1.75m y peso 80kg
    Given que ingreso una altura de 1.75 metros y un peso de 80 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 26.12
    And la categoría debería ser "Sobrepeso"

  Scenario: Calcular IMC con altura 1.79m y peso 83kg
    Given que ingreso una altura de 1.79 metros y un peso de 83 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 25.90
    And la categoría debería ser "Sobrepeso"

  Scenario: Calcular IMC con altura 1.54m y peso 71kg
    Given que ingreso una altura de 1.54 metros y un peso de 71 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 29.94
    And la categoría debería ser "Sobrepeso"

  # Obesidad
  Scenario: Calcular IMC con altura 1.75m y peso 100kg
    Given que ingreso una altura de 1.75 metros y un peso de 100 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 32.65
    And la categoría debería ser "Obeso"

  Scenario: Calcular IMC con altura 1.75m y peso 500kg
    Given que ingreso una altura de 1.75 metros y un peso de 500 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 163.27
    And la categoría debería ser "Obeso"

  Scenario: Calcular IMC con altura 1.00m y peso 30kg
    Given que ingreso una altura de 1.00 metros y un peso de 30 kg
    When calculo el IMC
    Then el resultado debería ser aproximadamente 30.00
    And la categoría debería ser "Obeso"