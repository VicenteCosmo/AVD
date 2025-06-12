from django.db import models, connection
from django.db.utils import ProgrammingError


class TableManager(models.Manager):
    def create_custom_table(self, table_name, fields_definition):
    
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*)
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = %s;
            """, [table_name])
            if cursor.fetchone()[0] > 0:
                raise ProgrammingError(f"Tabela '{table_name}' já existe")

            columns = []
            for field in fields_definition:
                col_type = field['type'].upper()

                if field.get('length'):
                    if field['type'].lower() in ['varchar', 'char']:
                        col_type += f"({field['length']})"
                    elif field['type'].lower() in ['decimal', 'numeric']:
                        col_type += f"({field['length']}, 2)"  # Padrão: 2 casas decimais

                constraints = field.get('constraints', '')
                if 'AUTO_INCREMENT' in constraints:
                    col_type = "SERIAL"
                    constraints = constraints.replace("AUTO_INCREMENT", "").strip()

                column_def = f"{field['name']} {col_type}"
                if constraints:
                    column_def += f" {constraints}"
                
                columns.append(column_def.strip())

            create_sql = f"""
                CREATE TABLE {table_name} (
                    {', '.join(columns)}
                );
            """

            try:
                cursor.execute(create_sql)
                self.create(table_name=table_name)
                return True
            except Exception as e:
                raise ProgrammingError(f"Erro ao criar tabela: {str(e)}")

class TableCreator(models.Model):
    table_name = models.CharField(max_length=100, unique=True, blank=True)
    objects = TableManager()

    class Meta:
        db_table = "table_crea" 
