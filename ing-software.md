# Documento de Ingeniería de Software: Sistema Interno de Gestión de Onboarding

## 1. Información General del Proyecto

Proyecto: Onboarding Management.
Cliente: Sinergia Financiera.
Empresa Desarrolladora: WeCoding.
Líder Técnico y Scrum Master: Juan David Restrepo Montoya.
Estado: Fase inicial, sin desarrollo previo.

## 2. Descripción General del Sistema

Una corporación en crecimiento requiere optimizar y centralizar su proceso de ingreso de nuevos colaboradores mediante un sistema web. Actualmente, la coordinación entre áreas operativas se realiza manualmente, generando retrasos. El nuevo sistema gestionará las solicitudes de insumos y activos para garantizar que el empleado disponga de todo lo necesario desde su primer día.

## 3. Arquitectura y Stack Tecnológico

El proyecto se construirá bajo los estándares de modernidad y escalabilidad requeridos.
Arquitectura: Se utilizará un patrón arquitectónico Modelo-Vista-Controlador (MVC) para aislar la vista de la lógica de negocio.

Frontend y Backend: Next.js servirá como el framework principal del proyecto. El diseño de la interfaz de usuario será "Responsive", adaptándose a dispositivos móviles y de escritorio.

Base de Datos: El motor de base de datos relacional será MySQL. La comunicación con la base de datos se gestionará a través del ORM Sequelize.
Integraciones de Terceros (API): El sistema consumirá servicios web externos (como SendGrid o gestores de identidad) para automatizar el envío de credenciales y notificaciones a los nuevos usuarios.
Inteligencia Artificial: Se implementará un modelo de IA predictiva/generativa que analizará el cargo del empleado para sugerir planes de capacitación e insumos técnicos basándose en datos históricos.
Despliegue e Infraestructura: El sistema será desplegado en Vercel bajo un dominio público.
Control de Versiones y Documentación: El código fuente se alojará en repositorios de GitHub, y toda la documentación técnica y manuales se redactarán en formato Markdown.

## 4. Módulos del Sistema

Módulo de Administración de Procesos de Ingreso
Permite al área de Selección y Reclutamiento crear registros de ingreso con campos obligatorios (código, nombre, documento, cargo, área, fecha de ingreso, jefe inmediato).

Actúa como disparador automático de solicitudes hacia las áreas operativas con fechas máximas de cumplimiento.

Un administrador puede editar o cancelar un proceso si ninguna área ha marcado tareas como "Finalizadas".

La fecha de ingreso puede postergarse, pero nunca adelantarse.
Módulo de Solicitudes por Área
Las áreas operativas (TI, Dotación, Servicios Generales, Formación) cuentan con paneles independientes para gestionar sus pendientes.

Los operadores pueden marcar los ítems en estados de Pendiente, En Proceso o Entregado.

Servicios Generales gestionará la asignación de puestos mediante un plano interactivo de la oficina, similar al mapa de sillas de un avión.

El jefe inmediato del empleado debe ingresar para validar precisiones técnicas, como el perfil tecnológico (tipo de computador y licencias) y las tallas para uniformes.

El sistema notifica vía correo a los responsables al crearse un proceso.
Módulo de Seguimiento y "Check-in"
Confirma la recepción de todos los activos el día de ingreso, generando un Acta de Entrega en formato PDF.

El empleado confirma la aceptación mediante un código enviado a su correo personal, sirviendo como firma digital.
Módulo de Reportes y Recomendación
Genera gráficas de eficiencia que evidencian el cumplimiento y los retrasos por área antes de la fecha de ingreso.

Basado en el cargo, el sistema sugiere un "Kit estándar" de hardware y software solicitado en ingresos previos.

## 5. Módulo de Usuarios y Roles

El sistema estructura el control de acceso en los siguientes niveles:
Root: Usuario maestro que crea a los "Administradores de Área".

Administrador (Recursos Humanos): Control total sobre la administración de procesos (crear, editar, cancelar).

Jefe Inmediato: Visualiza ingresos de su área y completa detalles técnicos de las solicitudes.

Operador de Área: Solo visualiza solicitudes asignadas a su departamento para marcarlas como completadas.

## 6. Modelo de Base de Datos

La base de datos MySQL relacional respaldará la operación a través de las siguientes entidades principales (gestionadas vía Sequelize):
roles / areas / users: Gestión de acceso y estructura organizacional.
onboarding_processes: Tabla central que consolida la información del nuevo empleado y su estado ("Pendiente", "Cancelado" o "Ingresos Exitosos").
area_requests: Traza los requerimientos específicos hacia cada área operativa.
technical_requirements / workstations / training_plans / assets_deliveries: Tablas satélites para perfiles tecnológicos, planos interactivos, rutas de formación y el acta de entrega final.
position_templates: Base de conocimiento para las recomendaciones de la IA sobre insumos y capacitaciones.

## 7. Metodología de Trabajo

Marco de Trabajo: Se aplicará la metodología ágil Scrum.
Entregas: El proyecto se ha estructurado para ser completado en 4 entregas principales.
Responsabilidades Iniciales: El Scrum Master (Juan David Restrepo) es el encargado de definir el backlog inicial y proponer el cronograma de las 4 entregas. El cliente debe validar el alcance.
