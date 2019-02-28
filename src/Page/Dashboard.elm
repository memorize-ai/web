port module Page.Dashboard exposing (main)

import Browser
import Html exposing (Html, h1, button, div, text, img)
import Html.Attributes exposing (src)
import Html.Events exposing (onClick)
import Page.Template as Template

port signOut : () -> Cmd msg
port signedOut : (() -> msg) -> Sub msg
port updateUser : (User -> msg) -> Sub msg

type alias User = { displayName : String, uid : String }
type alias Deck =
    { id : String
    , mastered : Int
    , count : Maybe Int
    , photoUrl : Maybe String
    , name : Maybe String
    }

type alias Model =
    { user : Maybe User
    , myDecks : List Deck
    }

type Msg
    = UpdatedUser User
    | SignOut
    | SignedOut

main : Program () Model Msg
main =
    Browser.document
        { init = \_ -> (Model Nothing [], Cmd.none)
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

view : Model -> Browser.Document Msg
view model =
    case model.user of
        Nothing -> viewWithoutUser model
        Just user -> viewWithUser model user

viewWithoutUser : Model -> Browser.Document Msg
viewWithoutUser model =
    { title = "Dashboard - memorize.ai"
    , body =
        Template.viewApp
            [ h1 [] [ text "Dashboard" ]
            , img [ src "images/infinity.gif" ] []
            ]
            model.user SignOut
    }

viewWithUser : Model -> User -> Browser.Document Msg
viewWithUser model user =
    { title = "Dashboard for " ++ user.displayName ++ " - memorize.ai"
    , body =
        Template.viewApp
            [ h1 [] [ text <| "Logged in as " ++ user.displayName  ++ " with id " ++ user.uid ]
            ]
            model.user SignOut
    }

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdatedUser user ->
            ( { model | user = Just user }, Cmd.none )
        SignOut ->
            ( model, signOut () )
        SignedOut ->
            ( { model | user = Nothing }, Cmd.none )
            
subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ updateUser UpdatedUser
        , signedOut (always SignedOut)
        ]
