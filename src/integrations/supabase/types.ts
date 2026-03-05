export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string
          nome: string | null
          email: string | null
          autorizacao: string | null
          loja_id: string | null
          atualizado_em: string | null
        }
        Insert: {
          id: string
          nome?: string | null
          email?: string | null
          autorizacao?: string | null
          loja_id?: string | null
          atualizado_em?: string | null
        }
        Update: {
          id?: string
          nome?: string | null
          email?: string | null
          autorizacao?: string | null
          loja_id?: string | null
          atualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfis_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
          }
        ]
      }
      clientes: {
        Row: {
          id: string
          nome: string
          whatsapp: string
          email: string | null
          endereco: string | null
          idade_crianca: string | null
          genero_crianca: string | null
          loja_id: string | null
          last_interaction: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          nome: string
          whatsapp: string
          email?: string | null
          endereco?: string | null
          idade_crianca?: string | null
          genero_crianca?: string | null
          loja_id?: string | null
          last_interaction?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          nome?: string
          whatsapp?: string
          email?: string | null
          endereco?: string | null
          idade_crianca?: string | null
          genero_crianca?: string | null
          loja_id?: string | null
          last_interaction?: string | null
          criado_em?: string | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          id: string
          nome: string
          categoria: string | null
          subcategoria: string | null
          genero: string | null
          idade_min: string | null
          idade_max: string | null
          meses_min: number | null
          meses_max: number | null
          descricao_curta: string | null
          descricao_completa: string | null
          material: string | null
          instrucoes_lavagem: string | null
          preco: number | null
          custo: number | null
          estoque_atual: number | null
          estoque_minimo: number | null
          sku: string | null
          imagem_url: string | null
          fornecedor_id: string | null
          loja_id: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          nome: string
          categoria?: string | null
          subcategoria?: string | null
          genero?: string | null
          idade_min?: string | null
          idade_max?: string | null
          meses_min?: number | null
          meses_max?: number | null
          descricao_curta?: string | null
          descricao_completa?: string | null
          material?: string | null
          instrucoes_lavagem?: string | null
          preco?: number | null
          custo?: number | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          sku?: string | null
          imagem_url?: string | null
          fornecedor_id?: string | null
          loja_id?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          nome?: string
          categoria?: string | null
          subcategoria?: string | null
          genero?: string | null
          idade_min?: string | null
          idade_max?: string | null
          meses_min?: number | null
          meses_max?: number | null
          descricao_curta?: string | null
          descricao_completa?: string | null
          material?: string | null
          instrucoes_lavagem?: string | null
          preco?: number | null
          custo?: number | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          sku?: string | null
          imagem_url?: string | null
          fornecedor_id?: string | null
          loja_id?: string | null
          criado_em?: string | null
        }
        Relationships: []
      }
      movimentacoes_estoque: {
        Row: {
          id: string
          produto_id: string | null
          quantidade: number
          tipo: string
          loja_id: string | null
          motivo: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          produto_id?: string | null
          quantidade: number
          tipo: string
          loja_id?: string | null
          motivo?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          produto_id?: string | null
          quantidade?: number
          tipo?: string
          motivo?: string | null
          criado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          }
        ]
      }
      transacoes: {
        Row: {
          id: string
          descricao: string | null
          valor: number
          tipo: string
          categoria: string | null
          loja_id: string | null
          data: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          descricao?: string | null
          valor: number
          tipo: string
          categoria?: string | null
          loja_id?: string | null
          data?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          descricao?: string | null
          valor?: number
          tipo?: string
          categoria?: string | null
          data?: string | null
          criado_em?: string | null
        }
        Relationships: []
      }
      colaboradores: {
        Row: {
          id: string
          nome: string
          cpf: string | null
          cargo: string | null
          salario: number | null
          data_admissao: string | null
          status: string | null
          loja_id: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          nome: string
          cpf?: string | null
          cargo?: string | null
          salario?: number | null
          data_admissao?: string | null
          status?: string | null
          loja_id?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          nome?: string
          cpf?: string | null
          cargo?: string | null
          salario?: number | null
          data_admissao?: string | null
          status?: string | null
          loja_id?: string | null
          criado_em?: string | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          id: string
          nome_fantasia: string
          razao_social: string | null
          cnpj: string | null
          contato: string | null
          telefone: string | null
          email: string | null
          loja_id: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          nome_fantasia: string
          razao_social?: string | null
          cnpj?: string | null
          contato?: string | null
          telefone?: string | null
          email?: string | null
          loja_id?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          nome_fantasia?: string
          razao_social?: string | null
          cnpj?: string | null
          contato?: string | null
          telefone?: string | null
          email?: string | null
          loja_id?: string | null
          criado_em?: string | null
        }
        Relationships: []
      }
      vendas: {
        Row: {
          id: string
          cliente_id: string | null
          valor_total: number
          status: string
          loja_id: string | null
          data_venda: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          cliente_id?: string | null
          valor_total: number
          status?: string
          loja_id?: string | null
          data_venda?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          cliente_id?: string | null
          valor_total?: number
          status?: string
          loja_id?: string | null
          data_venda?: string | null
          criado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      reservas_ia: {
        Row: {
          id: number
          cliente_id: string | null
          produto_id: string | null
          variante_id: string | null
          status: string
          data_reserva: string | null
          expiracao: string | null
          entregue_por: string | null
          notas: string | null
          loja_id: string | null
        }
        Insert: {
          id?: number
          cliente_id?: string | null
          produto_id?: string | null
          variante_id?: string | null
          status?: string
          data_reserva?: string | null
          expiracao?: string | null
          entregue_por?: string | null
          notas?: string | null
          loja_id?: string | null
        }
        Update: {
          id?: number
          cliente_id?: string | null
          produto_id?: string | null
          variante_id?: string | null
          status?: string
          data_reserva?: string | null
          expiracao?: string | null
          entregue_por?: string | null
          notas?: string | null
          loja_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservas_ia_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_ia_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_ia_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes_produto"
            referencedColumns: ["id"]
          }
        ]
      }
      chaves_ativacao: {
        Row: {
          id: string
          chave: string
          email_destino: string
          usada_em: string | null
          loja_criada_id: string | null
          modulo_predefinido: string | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          chave: string
          email_destino: string
          usada_em?: string | null
          loja_criada_id?: string | null
          modulo_predefinido?: string | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          chave?: string
          email_destino?: string
          usada_em?: string | null
          loja_criada_id?: string | null
          modulo_predefinido?: string | null
          criado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chaves_ativacao_loja_criada_id_fkey"
            columns: ["loja_criada_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
          }
        ]
      }
      lojas: {
        Row: {
          id: string
          nome: string
          modulo_ativo: string
          status: string
          criado_em: string | null
        }
        Insert: {
          id?: string
          nome: string
          modulo_ativo?: string
          status?: string
          criado_em?: string | null
        }
        Update: {
          id?: string
          nome?: string
          modulo_ativo?: string
          status?: string
          criado_em?: string | null
        }
        Relationships: []
      }
      variantes_produto: {
        Row: {
          id: string
          produto_id: string | null
          nome: string
          preco_adicional: number | null
          estoque_atual: number | null
        }
        Insert: {
          id?: string
          produto_id?: string | null
          nome: string
          preco_adicional?: number | null
          estoque_atual?: number | null
        }
        Update: {
          id?: string
          produto_id?: string | null
          nome?: string
          preco_adicional?: number | null
          estoque_atual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "variantes_produto_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
