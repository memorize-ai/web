module Page.Dashboard exposing (main)

import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)

type alias Model =
    { title : String
    }

type Msg
    = Msg

main : Program () Model Msg
main =
    Browser.document
        { init = \flags -> ({ title = "Dash" }, Cmd.none)
        , view = \model -> { title = model.title, body = [] }
        , update = \msg model -> ( model, Cmd.none )
        , subscriptions = \model -> Sub.none
        }
